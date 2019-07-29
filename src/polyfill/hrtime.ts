// Simply polyfill for hrtime
// https://nodejs.org/api/process.html#process_process_hrtime_time

const NS_PER_SEC: number = 1e9
let previousHrtime: [number, number] = [0, 0]
let hrtime: () => bigint

if (process.hrtime && process.hrtime.bigint) {
  // Use bigint if we support it
  hrtime = process.hrtime.bigint
} else {
  hrtime = () => {
    const diff = process.hrtime(previousHrtime)
    previousHrtime = process.hrtime()

    // Return the diff
    return ((diff[0] * NS_PER_SEC + diff[1]) as unknown) as bigint
  }
}

export default hrtime
