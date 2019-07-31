// An alternative fs for the browser and testing

import { createFsFromVolume, IFs } from "memfs";
import { Volume } from "memfs/lib/volume";

export const generateWasiFileSystem = () => {
  const volume: Volume = Volume.fromJSON({
    "/dev/stdin": "",
    "/dev/stdout": "",
    "/dev/stderr": ""
  });
  volume.releasedFds = [0, 1, 2];

  const wasiFs: IFs = createFsFromVolume(volume);
  return wasiFs;
};

export const getStdOutFromWasiFileSystem = async (wasiFs: IFs) => {
  // console.log(memfs.toJSON("/dev/stdout"))
  let promise = new Promise((resolve, reject) => {
    const rs_out = wasiFs.createReadStream("/dev/stdout", "utf8");
    // let prevData = ''
    rs_out.on("data", (data: Buffer) => {
      // prevData = prevData + data.toString('utf8')
      resolve(data.toString("utf8"));
    });
  });
  return await promise;
};