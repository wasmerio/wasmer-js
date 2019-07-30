// Simply polyfill for hrtime
// https://nodejs.org/api/process.html#process_process_hrtime_time

const NS_PER_SEC: number = 1e9
let hrtime: () => bigint

if (process.hrtime && process.hrtime.bigint) {
  // Use bigint if we support it
  hrtime = process.hrtime.bigint
} else {
  const baseTime: [number, number] = process.hrtime()
  hrtime = () => {
    const diff = process.hrtime(baseTime)

    // Return the time
    return ((diff[0] * NS_PER_SEC + diff[1]) as unknown) as bigint
  }
}

export default hrtime
