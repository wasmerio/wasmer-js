import hrtime from "../lib/polyfills/hrtime.bigint";

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
    expect(diffTime > 1.0e9 && diffTime < 1.3e9).toBeTruthy();

    // Wait an additoonal half a second
    await waitForTime(500);
    diffTime = hrtime() - start;
    expect(diffTime > 1.5e9 && diffTime < 1.8e9).toBeTruthy();
  });
});
