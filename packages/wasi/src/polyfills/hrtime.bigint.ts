// Simply polyfill for hrtime
// https://nodejs.org/api/process.html#process_process_hrtime_time

import { BigIntPolyfillType } from "./bigint";

const NS_PER_SEC: number = 1e9;

const getBigIntHrtime = (nativeHrtime: Function) => {
  return (time?: [number, number]) => {
    const diff = nativeHrtime(time);
    // Return the time
    return ((diff[0] * NS_PER_SEC + diff[1]) as unknown) as BigIntPolyfillType;
  };
};

export default getBigIntHrtime;
