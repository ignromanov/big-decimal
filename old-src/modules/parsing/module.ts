import { BigDecimal, type BigDecimalTypes } from "@/core";
import { ParserBigDecimal } from "./decimal-parser.class";

export const ParsingModule: BigDecimalTypes.ParsingModule = {
  name: "parsing",
  register(target: typeof BigDecimal) {
    // Add static parse method
    Object.assign(target, {
      parse: ParserBigDecimal.parse.bind(ParserBigDecimal),
    });
  },
};
