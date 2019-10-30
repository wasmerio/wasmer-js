import WasmTTY from "../src/wasm-tty/wasm-tty";

describe("WasmTty", () => {
  let wasmTty: WasmTTY;
  let xtermMock: any;

  beforeEach(async () => {
    xtermMock = {
      write: jest.fn(() => {}),
      cols: 10,
      rows: 10
    };

    // @ts-ignore
    wasmTty = new WasmTTY(xtermMock);
    wasmTty.println = jest.fn(message => wasmTty.print(message));
  });

  it("should print", async () => {
    wasmTty.print("Wasmer");
    expect(xtermMock.write.mock.calls.length).toBe(1);
  });

  it("should print wide", async () => {
    wasmTty.printWide(["Yo", "Yoo"], 2);
    expect(xtermMock.write.mock.calls.length).toBe(1);
    expect(xtermMock.write.mock.calls[0][0]).toBe("Yo   Yoo  ");
  });

  it("should apply restrictions to cursor", async () => {
    wasmTty.setInput("Yo");

    wasmTty.setCursor(-1);
    expect(wasmTty._cursor).toBe(0);

    wasmTty.setCursor(100);
    expect(wasmTty._cursor).toBe(2);
  });
});
