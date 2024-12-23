import { BigDecimalFactory as BD } from "@/core";
import { afterAll, beforeAll, describe, it } from "vitest";
import * as inspector from "inspector";
import * as fs from "fs";
import * as path from "path";

interface ProfileResult {
  profile: unknown;
}

const PROFILES_DIR = path.join(process.cwd(), "profiles");

// Создаем директорию для профилей, если её нет
if (!fs.existsSync(PROFILES_DIR)) {
  fs.mkdirSync(PROFILES_DIR, { recursive: true });
}

beforeAll(() => {
  BD.config({
    DECIMAL_PLACES: 20,
    ROUNDING_MODE: 4,
    EXPONENTIAL_AT: [-7, 20],
    ALPHABET: "0123456789abcdefghijklmnopqrstuvwxyz",
  });
});

describe("BigDecimal deep operations profiling", () => {
  const session = new inspector.Session();

  beforeAll(() => {
    session.connect();
  });

  afterAll(() => {
    session.disconnect();
  });

  const runWithProfiling = async (operations: () => void): Promise<unknown> => {
    return new Promise((resolve, reject) => {
      try {
        session.post("Profiler.enable");
        session.post("Profiler.start");

        operations();

        session.post(
          "Profiler.stop",
          (err: Error | null, { profile }: ProfileResult) => {
            if (err) reject(err);
            resolve(profile);
          }
        );
      } catch (error) {
        reject(error);
      }
    });
  };

  const saveProfile = (profile: unknown, label: string) => {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const filename = `profile-${label}-${timestamp}.cpuprofile`;
      const profileFile = path.join(PROFILES_DIR, filename);
      fs.writeFileSync(profileFile, JSON.stringify(profile, null, 2));
      return profileFile;
    } catch (error) {
      console.error("Failed to save profile:", error);
      throw error;
    }
  };

  it("profile all nested operations", async () => {
    // Прогрев перед профилированием
    for (let i = 0; i < 1000; i++) {
      BD.from("0.1").plus("0.2").times("0.2");
    }

    const num1 = BD.from("123.456");
    const num2 = BD.from("789.012");
    const num3 = BD.from("0.333");
    const largeNum = BD.from("9".repeat(100));
    const smallNum = BD.from("0." + "0".repeat(100) + "1");

    // Профилируем создание объектов
    const creationProfile = await runWithProfiling(() => {
      BD.from("123.456");
      BD.from(12345);
      BD.from(BigInt("12345"));
      BD.from(largeNum);
    });

    // Профилируем базовые операции
    const basicProfile = await runWithProfiling(() => {
      num1.plus(num2);
      num1.minus(num2);
      num1.times(num2);
      num1.div(num2);
    });

    // Профилируем сложные операции
    const complexProfile = await runWithProfiling(() => {
      largeNum.div(smallNum);
      largeNum.times(largeNum);
      smallNum.div(smallNum);
    });

    // Профилируем цепочку операций
    const chainProfile = await runWithProfiling(() => {
      num1.plus(num2).times(num3).div(num1.plus(num2)).minus(num1.minus(num2));
    });

    // Сохраняем результаты
    const files = {
      creation: saveProfile(creationProfile, "creation"),
      basic: saveProfile(basicProfile, "basic"),
      complex: saveProfile(complexProfile, "complex"),
      chain: saveProfile(chainProfile, "chain"),
    };

    console.log("Profile files saved:", {
      creation: path.relative(process.cwd(), files.creation),
      basic: path.relative(process.cwd(), files.basic),
      complex: path.relative(process.cwd(), files.complex),
      chain: path.relative(process.cwd(), files.chain),
    });
  });
});
