import { formatError } from "./format-error";
import Defer from "@suchipi/defer";

/**
 * A helper function suitable for use in command-line applications. Runs the
 * provided "main" function (which can be sync or async), and if it errors,
 * format the error message, print it to stderr, and call `process.exit(1)`
 *
 * The Promise returned by this function resolves when `mainFunction` succeeds
 * and rejects when it errors.
 */
export function runMain(
  /**
   * The function to run. If it's async, it'll be `await`ed.
   */
  mainFunction: () => any,
  runOptions: {
    /**
     * The function used to exit when an error occurs. If called, it will
     * receive the value `1`.
     *
     * Defaults to `process.exit`.
     */
    exit?: (code: number) => void;
    /**
     * The function used to print the formatted error text.
     *
     * Defaults to `console.error`, which writes to stderr.
     */
    printError?: (formattedError: string) => void;
    /**
     * The function used to convert an unknown value to a string when a
     * non-error value is thrown.
     *
     * Defaults to `require("util").inspect`.
     */
    inspect?: (value: any) => string;
  } = {},
): Promise<void> {
  const inspect = runOptions.inspect ?? require("util").inspect;
  const printError = runOptions.printError ?? console.error;
  const exit = runOptions.exit ?? process.exit.bind(process);

  const defer = new Defer<void>();

  try {
    const result = mainFunction();
    if (
      typeof result === "object" &&
      result != null &&
      typeof result.then === "function"
    ) {
      result.then(
        () => {
          defer.resolve();
        },
        (err: any) => {
          printError(formatError(err, inspect));
          defer.reject(err);
          exit(1);
        },
      );
    } else {
      defer.resolve();
    }
  } catch (err) {
    printError(formatError(err, inspect));
    defer.reject(err);
    exit(1);
  }

  return defer.promise;
}
