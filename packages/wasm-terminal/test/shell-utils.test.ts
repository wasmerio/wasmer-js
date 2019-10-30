import * as ShellUtils from "../src/wasm-shell/shell-utils";

describe("ShellUtils", () => {
  describe("wordBoundaries", () => {
    it("should pass golden test", async () => {
      expect(ShellUtils.wordBoundaries("test 1 2 for you")).toStrictEqual([
        0,
        5,
        7,
        9,
        13
      ]);
    });
  });

  describe("closestLeftBoundary", () => {
    it("should pass golden test", async () => {
      expect(true).toBe(true);
      expect(ShellUtils.closestLeftBoundary("test 1 2 for you", -1)).toBe(0);
      expect(ShellUtils.closestLeftBoundary("test 1 2 for you", 2)).toBe(0);
      expect(ShellUtils.closestLeftBoundary("test 1 2 for you", 4)).toBe(0);
      expect(ShellUtils.closestLeftBoundary("test 1 2 for you", 6)).toBe(5);
      expect(ShellUtils.closestLeftBoundary("test 1 2 for you", 7)).toBe(5);
      expect(ShellUtils.closestLeftBoundary("test 1 2 for you", 100)).toBe(13);
    });
  });

  describe("isIncompleteInput", () => {
    it("should handle complete input", async () => {
      expect(ShellUtils.isIncompleteInput("test 1 2 for you")).toBe(false);
    });

    it("should handle single quote", async () => {
      expect(ShellUtils.isIncompleteInput("test 1 2 ' for you")).toBe(true);
    });

    it("should handle double quote", async () => {
      expect(ShellUtils.isIncompleteInput('test 1 2 " for you')).toBe(true);
    });

    it("should handle trailing slash", async () => {
      expect(ShellUtils.isIncompleteInput("test 1 2 for you \\")).toBe(true);
    });

    it("should handle trailing incomplete boolean", async () => {
      expect(ShellUtils.isIncompleteInput("test 1 2 for you &&")).toBe(true);
      expect(ShellUtils.isIncompleteInput("test 1 2 for you ||")).toBe(true);
    });

    it("should handle trailing pipe", async () => {
      expect(ShellUtils.isIncompleteInput("test 1 2 for you |")).toBe(true);
    });
  });

  describe("hasTrailingWhitespace", () => {
    it("should pass golden test", async () => {
      expect(ShellUtils.hasTrailingWhitespace("test 1 2 for you")).toBe(false);

      expect(ShellUtils.hasTrailingWhitespace("test 1 2 for you ")).toBe(true);
      expect(ShellUtils.hasTrailingWhitespace("test 1 2 for you     ")).toBe(
        true
      );
      expect(ShellUtils.hasTrailingWhitespace("test 1 2 for you ")).toBe(true);
      expect(ShellUtils.hasTrailingWhitespace("test 1 2 for you ")).toBe(true);
    });
  });

  describe("getLastToken", () => {
    it("should pass golden test", async () => {
      expect(ShellUtils.getLastToken("test 1 2 for you")).toBe("you");
    });
  });

  describe("collectAutocompleteCandidates", () => {
    it("should pass golden test", async () => {
      const response = ShellUtils.collectAutocompleteCandidates(
        [
          (index, tokens) => {
            return ["test", "test2", "test3", "yo", "hi", "test4", "wasmboy"];
          }
        ],
        "te"
      );

      expect(response).toStrictEqual(["test", "test2", "test3", "test4"]);
    });
  });
});
