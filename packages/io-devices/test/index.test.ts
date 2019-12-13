import { WasmFs } from "../../wasmfs/src/index";
import { WasmFsIoDevices } from "../src/index";

describe("wasmfs-io-devices", () => {
  let wasmfs: WasmFs;
  let wasmfsIoDevices: WasmFsIoDevices;

  beforeEach(async () => {
    wasmfs = new WasmFs();
    wasmfsIoDevices = new WasmFsIoDevices(wasmfs);
  });

  it("should work", async () => {
    expect(true).toBe(true);
  });
});
