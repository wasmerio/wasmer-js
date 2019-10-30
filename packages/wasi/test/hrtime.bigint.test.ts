import { BigIntPolyfillType } from "../src/polyfills/bigint";
import getBigIntHrtime from "../src/polyfills/hrtime.bigint";

let hrtime: (time?: [number, number]) => BigIntPolyfillType = getBigIntHrtime(
  process.hrtime
);
if (process.hrtime && process.hrtime.bigint) {
  hrtime = process.hrtime.bigint;
}

const waitForTime = (milliseconds: number) => {
  return new Promise(resolve => {
    setTimeout(resolve, milliseconds);
  });
};

describe("hrtime Polyfill", () => {
  it("Should return an expected hrtime bigint value", async () => {
    const start: bigint = hrtime();
    let diffTime: bigint = (0 as unknown) as bigint;

    // Wait for a second
    await waitForTime(1000);
    diffTime = hrtime() - start;
    expect(diffTime > 0.9e9 && diffTime < 1.4e9).toBeTruthy();

    // Wait an additoonal half a second
    await waitForTime(500);
    diffTime = hrtime() - start;
    expect(diffTime > 1.4e9 && diffTime < 1.9e9).toBeTruthy();
  });
});
