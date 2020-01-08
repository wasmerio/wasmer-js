import { WasmFs } from "../../wasmfs/src/index";
import { IoDevices } from "../src/index";

describe("io-devices", () => {
  let wasmfs: WasmFs;
  let ioDevices: IoDevices;

  beforeEach(async () => {
    wasmfs = new WasmFs();
    ioDevices = new IoDevices(wasmfs);
  });

  it("should work", async () => {
    expect(true).toBe(true);
  });
});
