import "https://raw.githubusercontent.com/NeilFraser/JS-Interpreter/cbc4bc1850e3ca639bd1d8864b641b23e05fc813/interpreter.js";
// NOTE:
// We use the yorinasub17 fork for acorn to support Deno. The upstream repo uses this instead of globalThis, which
// causes Deno to error.
import "https://raw.githubusercontent.com/yorinasub17/JS-Interpreter/compat-cbc4bc1/acorn.js";

declare global {
  // deno-lint-ignore no-explicit-any no-var
  var acorn: any;
  // deno-lint-ignore no-explicit-any no-var
  var Interpreter: any;
}

// Patch Interpreter nativeGlobal so that it doesn't rely on real globalThis.
const acorn = globalThis.acorn;
globalThis.acorn = undefined;
const Interpreter = globalThis.Interpreter;
globalThis.Interpreter = undefined;
Interpreter.nativeGlobal = {
  acorn: acorn,
  RegExp: RegExp,
  Date: Date,
  Number: Number,
  Boolean: Boolean,
  String: String,
};

// Export the patched interpreter
export { Interpreter };
