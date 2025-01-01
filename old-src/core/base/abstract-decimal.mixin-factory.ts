// import { EnhancedBigDecimal } from "../implementations/enhanced-decimal.class";
// import { BigDecimalTypes } from "./types.namespace";

// export class BigDecimalFactory {
//   private constructor() {
//     // Prevent instantiation
//   }

//   private static readonly moduleRegistry: Record<
//     BigDecimalTypes.ModuleNames,
//     BigDecimalTypes.ModuleImplementation | null
//   > = {
//     arithmetic: null,
//     formatting: null,
//     comparison: null,
//   };

//   /**
//    * Registers a module implementation for future use
//    * @internal
//    */
//   static registerModuleImplementation(
//     name: BigDecimalTypes.ModuleNames,
//     implementation: BigDecimalTypes.ModuleImplementation
//   ): void {
//     this.moduleRegistry[name] = implementation;
//   }

//   /**
//    * Creates a configured BigDecimal class with selected modules
//    */
//   static configure<T extends BigDecimalTypes.ModuleNames[]>(...modules: T) {
//     let BaseClass = EnhancedBigDecimal;

//     // Apply each module
//     for (const moduleName of modules) {
//       const implementation = this.moduleRegistry[moduleName];
//       if (implementation) {
//         BaseClass = implementation(BaseClass);
//       }
//     }

//     return BaseClass;
//   }

//   /**
//    * Predefined configurations
//    */
//   static readonly presets = {
//     /**
//      * Basic BigDecimal without additional modules
//      */
//     basic: () => this.configure(),

//     /**
//      * BigDecimal with arithmetic operations
//      */
//     arithmetic: () => this.configure("arithmetic"),

//     /**
//      * BigDecimal with all available modules
//      */
//     full: () => this.configure("arithmetic", "formatting", "comparison"),
//   } as const;
// }
