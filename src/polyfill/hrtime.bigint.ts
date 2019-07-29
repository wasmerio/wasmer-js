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
    baseTime[0] += diff[0]
    baseTime[1] += diff[1]

    while (baseTime[1] >= 10e9) {
      baseTime[1] -= 10e9
      baseTime[0] += 1
    }

    // Return the time
    return ((baseTime[0] * NS_PER_SEC + baseTime[1]) as unknown) as bigint
  }
}

export default hrtime
