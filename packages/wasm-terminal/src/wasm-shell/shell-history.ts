/**
 * The shell history provides an ring-buffer
 */
export default class ShellHistory {
  size: number;
  entries: Array<string>;
  cursor: number;

  constructor(size: number) {
    this.size = size;
    this.entries = [];
    this.cursor = 0;
  }

  /**
   * Push an entry and maintain ring buffer size
   */
  push(entry: string) {
    // Skip empty entries
    if (entry.trim() === "") return;
    // Skip duplicate entries
    const lastEntry = this.entries[this.entries.length - 1];
    if (entry === lastEntry) return;
    // Keep track of entries
    this.entries.push(entry);
    if (this.entries.length > this.size) {
      this.entries.pop();
    }
    this.cursor = this.entries.length;
  }

  /**
   * Check if the history includes an entry
   */
  includes(entry: string) {
    return this.entries.includes(entry);
  }

  /**
   * Rewind history cursor on the last entry
   */
  rewind() {
    this.cursor = this.entries.length;
  }

  /**
   * Returns the previous entry
   */
  getPrevious() {
    const idx = Math.max(0, this.cursor - 1);
    this.cursor = idx;
    return this.entries[idx];
  }

  /**
   * Returns the next entry
   */
  getNext() {
    const idx = Math.min(this.entries.length, this.cursor + 1);
    this.cursor = idx;
    return this.entries[idx];
  }
}
