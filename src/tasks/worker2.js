console.log("XXX: Inside the worker");
Error.stackTraceLimit = 50;
globalThis.onerror = console.error;
