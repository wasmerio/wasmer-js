// hrtime polyfill for the browser

const baseNow = Math.floor((Date.now() - performance.now()) * 1e-3);

export default function hrtime(previousTimestamp: any) {
  // initilaize our variables
  let clocktime = performance.now() * 1e-3;
  let seconds = Math.floor(clocktime) + baseNow;
  let nanoseconds = Math.floor((clocktime % 1) * 1e9);

  // Compare to the prvious timestamp if we have one
  if (previousTimestamp) {
    seconds = seconds - previousTimestamp[0];
    nanoseconds = nanoseconds - previousTimestamp[1];
    if (nanoseconds < 0) {
      seconds--;
      nanoseconds += 1e9;
    }
  }
  // Return our seconds tuple
  return [seconds, nanoseconds];
}
