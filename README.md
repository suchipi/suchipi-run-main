# `@suchipi/run-main`

A helper function suitable for use in command-line applications. Runs the user-provided "main" function (which can be sync or async), and if it errors, formats the error message, prints it to stderr, and calls `process.exit(1)`.

```ts
export function runMain(
  /**
   * The function to run. If it's async, it'll be `await`ed.
   */
  mainFunction: () => any,
  runOptions?: {
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
  },
): Promise<void>;
```
