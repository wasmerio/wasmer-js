// Simply polyfill for hrtime
// https://nodejs.org/api/process.html#process_process_hrtime_time

import { BigIntPolyfillType } from "./bigint";

const NS_PER_SEC: number = 1e9;
let hrtime: (time?: [number, number]) => BigIntPolyfillType;

if (process.hrtime && process.hrtime.bigint) {
  // Use bigint if we support it
  hrtime = process.hrtime.bigint;
} else {
  const baseTime: [number, number] = process.hrtime();
  hrtime = (time?: [number, number]) => {
    const diff = process.hrtime(time || baseTime);

    // Return the time
    return ((diff[0] * NS_PER_SEC + diff[1]) as unknown) as BigIntPolyfillType;
  };
}

export default hrtime;
