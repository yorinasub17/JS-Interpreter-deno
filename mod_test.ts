import { assertEquals, assertThrows } from "./test_deps.ts";

import { Interpreter } from "./mod.ts";

enum LogLevel {
  Info = "info",
  Warn = "warn",
  Error = "error",
}

interface LogEntry {
  level: LogLevel;
  msg: string;
}

// deno-lint-ignore no-explicit-any
function objsToString(objs: any[]): string {
  const msgs: string[] = [];
  for (const o of objs) {
    msgs.push(`${o}`);
  }
  return msgs.join(" ");
}

function runCodeAndGetLogs(code: string): LogEntry[] {
  const logs: LogEntry[] = [];

  const interpreter = new Interpreter(
    code,
    // deno-lint-ignore no-explicit-any
    (interpreter: any, scope: any) => {
      // Setup the console object so that the user functions can emit debug logs for introspection.
      const nativeConsole = interpreter.createObjectProto(
        interpreter.OBJECT_PROTO,
      );
      interpreter.setProperty(
        nativeConsole,
        "log",
        // deno-lint-ignore no-explicit-any
        interpreter.createNativeFunction((...objs: any[]) => {
          logs.push({
            level: LogLevel.Info,
            msg: objsToString(objs),
          });
        }),
      );
      interpreter.setProperty(
        nativeConsole,
        "warn",
        // deno-lint-ignore no-explicit-any
        interpreter.createNativeFunction((...objs: any[]) => {
          logs.push({
            level: LogLevel.Warn,
            msg: objsToString(objs),
          });
        }),
      );
      interpreter.setProperty(
        nativeConsole,
        "error",
        // deno-lint-ignore no-explicit-any
        interpreter.createNativeFunction((...objs: any[]) => {
          logs.push({
            level: LogLevel.Error,
            msg: objsToString(objs),
          });
        }),
      );
      interpreter.setProperty(scope, "console", nativeConsole);
    },
  );

  interpreter.run();
  return logs;
}

Deno.test("sanity check", () => {
  const code = `console.log("hello world")`;
  const logs = runCodeAndGetLogs(code);
  assertEquals(logs, [{ level: LogLevel.Info, msg: "hello world" }]);
});

Deno.test("XMLHTTPRequest not supported", () => {
  const code = `var req = new XMLHttpRequest();
req.addEventListener("readystatechange", function() {
  if (req.readyState === 4 && req.status === 200) {
    console.log("false");
  }
});
req.open("GET", inp[0].id);
req.send();
`;

  assertThrows(
    () => runCodeAndGetLogs(code),
    Error,
    "XMLHttpRequest is not defined",
  );
});

Deno.test("fetch is not supported", () => {
  const code = `fetch("https://example.com").then(function(response) {
  console.log("hello world");
});`;

  assertThrows(
    () => runCodeAndGetLogs(code),
    Error,
    "fetch is not defined",
  );
});

Deno.test("process is not supported", () => {
  const code = `console.log(process.env)`;

  assertThrows(
    () => runCodeAndGetLogs(code),
    Error,
    "process is not defined",
  );
});

Deno.test("Deno is not supported", () => {
  const code = `console.log(Deno.env)`;

  assertThrows(
    () => runCodeAndGetLogs(code),
    Error,
    "Deno is not defined",
  );
});
