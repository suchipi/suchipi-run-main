import { describe, test, expect } from "vitest";
import { runMain } from ".";

describe("happy path", () => {
  test("with sync fn, returns Promise<void>", async () => {
    let ran = false;
    const result = runMain(() => {
      ran = true;
      return 2 + 2;
    });
    expect(ran).toBe(true);
    expect(typeof result.then).toBe("function");
    const resolved = await result;
    expect(resolved).toBe(undefined);
  });

  test("with async fn, returns Promise<void>", async () => {
    let ran = false;
    const result = runMain(async () => {
      ran = true;
      return 2 + 2;
    });
    expect(ran).toBe(true);
    expect(typeof result.then).toBe("function");
    const resolved = await result;
    expect(resolved).toBe(undefined);
  });
});

describe("error thrown", () => {
  test("from sync function", async () => {
    let exitCode: number | null = null;
    const printedErrors: Array<string> = [];

    const options = {
      printError: (errorMsg: string) => {
        printedErrors.push(errorMsg);
      },
      exit: (code: number) => {
        exitCode = code;
      },
    };

    let progress = 0;
    const result = await runMain(() => {
      progress++;
      throw new Error(
        "uh oh! we're in trouble! something's come along and it's burst our bubble!",
      );
      progress++;
    }, options).catch((err) => err);

    expect({
      result,
      progress,
      printedErrors,
      exitCode,
    }).toMatchInlineSnapshot(`
      {
        "exitCode": 1,
        "printedErrors": [
          "Error: uh oh! we're in trouble! something's come along and it's burst our bubble!

      ./src/index.test.ts:47:13                                                      
      45   |     const result = await runMain(() => {
      46   |       progress++;
      47 > |       throw new Error(
      48   |         "uh oh! we're in trouble! something's come along and it's bur...
      49   |       );
      50   |       progress++;

        at /Users/suchipi/Code/suchipi-run-main/src/index.test.ts:47:13
        at Module.runMain (/Users/suchipi/Code/suchipi-run-main/src/index.ts:47:20)
        at /Users/suchipi/Code/suchipi-run-main/src/index.test.ts:45:26
        at file:///Users/suchipi/Code/suchipi-run-main/node_modules/@vitest/runner/dist/index.js:134:14
        at file:///Users/suchipi/Code/suchipi-run-main/node_modules/@vitest/runner/dist/index.js:59:26
        at runTest (file:///Users/suchipi/Code/suchipi-run-main/node_modules/@vitest/runner/dist/index.js:719:17)
        at runSuite (file:///Users/suchipi/Code/suchipi-run-main/node_modules/@vitest/runner/dist/index.js:847:15)
        at runSuite (file:///Users/suchipi/Code/suchipi-run-main/node_modules/@vitest/runner/dist/index.js:847:15)
        at runFiles (file:///Users/suchipi/Code/suchipi-run-main/node_modules/@vitest/runner/dist/index.js:896:5)
        at startTests (file:///Users/suchipi/Code/suchipi-run-main/node_modules/@vitest/runner/dist/index.js:905:3)",
        ],
        "progress": 1,
        "result": [Error: uh oh! we're in trouble! something's come along and it's burst our bubble!],
      }
    `);
  });

  test("from async function", async () => {
    let exitCode: number | null = null;
    const printedErrors: Array<string> = [];

    const options = {
      printError: (errorMsg: string) => {
        printedErrors.push(errorMsg);
      },
      exit: (code: number) => {
        exitCode = code;
      },
    };

    let progress = 0;
    const result = await runMain(async () => {
      progress++;
      throw new Error(
        "uh oh! we're in trouble! something's come along and it's burst our bubble!",
      );
      progress++;
    }, options).catch((err) => err);

    expect({
      result,
      progress,
      printedErrors,
      exitCode,
    }).toMatchInlineSnapshot(`
      {
        "exitCode": 1,
        "printedErrors": [
          "Error: uh oh! we're in trouble! something's come along and it's burst our bubble!

      ./src/index.test.ts:105:13                                                      
      103   |     const result = await runMain(async () => {
      104   |       progress++;
      105 > |       throw new Error(
      106   |         "uh oh! we're in trouble! something's come along and it's bur...
      107   |       );
      108   |       progress++;

        at /Users/suchipi/Code/suchipi-run-main/src/index.test.ts:105:13
        at Module.runMain (/Users/suchipi/Code/suchipi-run-main/src/index.ts:47:20)
        at /Users/suchipi/Code/suchipi-run-main/src/index.test.ts:103:26
        at file:///Users/suchipi/Code/suchipi-run-main/node_modules/@vitest/runner/dist/index.js:134:14
        at file:///Users/suchipi/Code/suchipi-run-main/node_modules/@vitest/runner/dist/index.js:59:26
        at runTest (file:///Users/suchipi/Code/suchipi-run-main/node_modules/@vitest/runner/dist/index.js:719:17)
        at runSuite (file:///Users/suchipi/Code/suchipi-run-main/node_modules/@vitest/runner/dist/index.js:847:15)
        at runSuite (file:///Users/suchipi/Code/suchipi-run-main/node_modules/@vitest/runner/dist/index.js:847:15)
        at runFiles (file:///Users/suchipi/Code/suchipi-run-main/node_modules/@vitest/runner/dist/index.js:896:5)
        at startTests (file:///Users/suchipi/Code/suchipi-run-main/node_modules/@vitest/runner/dist/index.js:905:3)",
        ],
        "progress": 1,
        "result": [Error: uh oh! we're in trouble! something's come along and it's burst our bubble!],
      }
    `);
  });
});

describe("non-error value thrown", () => {
  test("from sync function", async () => {
    let exitCode: number | null = null;
    const printedErrors: Array<string> = [];

    const options = {
      printError: (errorMsg: string) => {
        printedErrors.push(errorMsg);
      },
      exit: (code: number) => {
        exitCode = code;
      },
    };

    let progress = 0;
    const result = await runMain(() => {
      progress++;
      throw 6;
      progress++;
    }, options).catch((err) => err);

    expect({
      result,
      progress,
      printedErrors,
      exitCode,
    }).toMatchInlineSnapshot(`
      {
        "exitCode": 1,
        "printedErrors": [
          "Error: Non-error value was thrown: 6

      ./src/format-error.ts:11:7                                              
      9    |   if (!pheno.isOfType(error, pheno.Error)) {
      10   |     return formatError(
      11 > |       new Error(\`Non-error value was thrown: \${inspect(error)}\`),
      12   |       inspect,
      13   |     );
      14   |   }

        at Module.formatError (/Users/suchipi/Code/suchipi-run-main/src/format-error.ts:11:7)
        at Module.runMain (/Users/suchipi/Code/suchipi-run-main/src/index.ts:67:16)
        at /Users/suchipi/Code/suchipi-run-main/src/index.test.ts:163:26
        at file:///Users/suchipi/Code/suchipi-run-main/node_modules/@vitest/runner/dist/index.js:134:14
        at file:///Users/suchipi/Code/suchipi-run-main/node_modules/@vitest/runner/dist/index.js:59:26
        at runTest (file:///Users/suchipi/Code/suchipi-run-main/node_modules/@vitest/runner/dist/index.js:719:17)
        at runSuite (file:///Users/suchipi/Code/suchipi-run-main/node_modules/@vitest/runner/dist/index.js:847:15)
        at runSuite (file:///Users/suchipi/Code/suchipi-run-main/node_modules/@vitest/runner/dist/index.js:847:15)
        at runFiles (file:///Users/suchipi/Code/suchipi-run-main/node_modules/@vitest/runner/dist/index.js:896:5)
        at startTests (file:///Users/suchipi/Code/suchipi-run-main/node_modules/@vitest/runner/dist/index.js:905:3)",
        ],
        "progress": 1,
        "result": 6,
      }
    `);
  });

  test("from async function", async () => {
    let exitCode: number | null = null;
    const printedErrors: Array<string> = [];

    const options = {
      printError: (errorMsg: string) => {
        printedErrors.push(errorMsg);
      },
      exit: (code: number) => {
        exitCode = code;
      },
    };

    let progress = 0;
    const result = await runMain(async () => {
      progress++;
      throw 6;
      progress++;
    }, options).catch((err) => err);

    expect({
      result,
      progress,
      printedErrors,
      exitCode,
    }).toMatchInlineSnapshot(`
      {
        "exitCode": 1,
        "printedErrors": [
          "Error: Non-error value was thrown: 6

      ./src/format-error.ts:11:7                                              
      9    |   if (!pheno.isOfType(error, pheno.Error)) {
      10   |     return formatError(
      11 > |       new Error(\`Non-error value was thrown: \${inspect(error)}\`),
      12   |       inspect,
      13   |     );
      14   |   }

        at Module.formatError (/Users/suchipi/Code/suchipi-run-main/src/format-error.ts:11:7)
        at /Users/suchipi/Code/suchipi-run-main/src/index.ts:58:22",
        ],
        "progress": 1,
        "result": 6,
      }
    `);
  });
});
