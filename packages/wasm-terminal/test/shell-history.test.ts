import ShellHistory from "../src/wasm-shell/shell-history";

describe("ShellHistory", () => {
  let shellHistory: ShellHistory;

  beforeEach(async () => {
    shellHistory = new ShellHistory(10);

    shellHistory.push("test");
    shellHistory.push("test2");
    shellHistory.push("test3");
  });

  it("should push elements", async () => {
    const entry = "test4";
    shellHistory.push(entry);
    expect(shellHistory.entries.length).toBe(4);
    expect(shellHistory.entries.pop()).toBe(entry);
  });

  it("should find elements", async () => {
    expect(shellHistory.includes("test2")).toBe(true);
  });

  it("should get the previous entry", async () => {
    const entry = shellHistory.getPrevious();
    expect(entry).toBe("test3");
  });

  it("should get the next entry while traversing", async () => {
    shellHistory.getPrevious();
    shellHistory.getPrevious();
    const entry = shellHistory.getNext();
    expect(entry).toBe("test3");
  });

  it("should be able to reset the cursor while traversing", async () => {
    shellHistory.getPrevious();
    shellHistory.getPrevious();
    shellHistory.getPrevious();
    shellHistory.rewind();
    const entry = shellHistory.getPrevious();
    expect(entry).toBe("test3");
  });

  it("should return the last element if you continually getPrevious()", async () => {
    for (let i = 0; i < 11; i++) {
      shellHistory.getPrevious();
    }
    const entry = shellHistory.getPrevious();
    expect(entry).toBe("test");
  });

  it("should return undefined if you continually getNext()", async () => {
    for (let i = 0; i < 11; i++) {
      shellHistory.getNext();
    }
    const entry = shellHistory.getNext();
    expect(entry).toBe(undefined);
  });
});
