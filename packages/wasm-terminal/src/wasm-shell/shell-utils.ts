import { parse, ParseEntry } from "shell-quote";

export interface ActiveCharPrompt {
  promptPrefix: string;
  promise: Promise<any>;
  resolve?: (what: string) => any;
  reject?: (error: Error) => any;
}

export interface ActivePrompt extends ActiveCharPrompt {
  continuationPromptPrefix: string;
}

/**
 * Detects all the word boundaries on the given input
 */
export function wordBoundaries(input: string, leftSide: boolean = true) {
  let match;
  const words = [];
  const rx = /\w+/g;

  match = rx.exec(input);
  while (match) {
    if (leftSide) {
      words.push(match.index);
    } else {
      words.push(match.index + match[0].length);
    }

    match = rx.exec(input);
  }

  return words;
}

/**
 * The closest left (or right) word boundary of the given input at the
 * given offset.
 */
export function closestLeftBoundary(input: string, offset: number) {
  const found = wordBoundaries(input, true)
    .reverse()
    .find(x => x < offset);
  return found === undefined ? 0 : found;
}
export function closestRightBoundary(input: string, offset: number) {
  const found = wordBoundaries(input, false).find(x => x > offset);
  return found === undefined ? input.length : found;
}

/**
 * Checks if there is an incomplete input
 *
 * An incomplete input is considered:
 * - An input that contains unterminated single quotes
 * - An input that contains unterminated double quotes
 * - An input that ends with "\"
 * - An input that has an incomplete boolean shell expression (&& and ||)
 * - An incomplete pipe expression (|)
 */
export function isIncompleteInput(input: string) {
  // Empty input is not incomplete
  if (input.trim() === "") {
    return false;
  }

  // Check for dangling single-quote strings
  if ((input.match(/'/g) || []).length % 2 !== 0) {
    return true;
  }
  // Check for dangling double-quote strings
  if ((input.match(/"/g) || []).length % 2 !== 0) {
    return true;
  }
  // Check for dangling boolean or pipe operations
  if ((input.split(/(\|\||\||&&)/g).pop() as string).trim() === "") {
    return true;
  }
  // Check for tailing slash
  if (input.endsWith("\\") && !input.endsWith("\\\\")) {
    return true;
  }

  return false;
}

/**
 * Returns true if the expression ends on a tailing whitespace
 */
export function hasTrailingWhitespace(input: string) {
  return input.match(/[^\\][ \t]$/m) !== null;
}

/**
 * Returns the last expression in the given input
 */
export function getLastToken(input: string): string {
  // Empty expressions
  if (input.trim() === "") return "";
  if (hasTrailingWhitespace(input)) return "";

  // Last token
  const tokens = parse(input);
  return (tokens.pop() as string) || "";
}

/**
 * Returns the auto-complete candidates for the given input
 */
export function collectAutocompleteCandidates(
  callbacks: ((index: number, tokens: string[]) => string[])[],
  input: string
): string[] {
  const tokens = parse(input);
  let index = tokens.length - 1;
  let expr = tokens[index] || "";

  // Empty expressions
  if (input.trim() === "") {
    index = 0;
    expr = "";
  } else if (hasTrailingWhitespace(input)) {
    // Expressions with danging space
    index += 1;
    expr = "";
  }

  // Collect all auto-complete candidates from the callbacks
  const all = callbacks.reduce((candidates, fn) => {
    try {
      let v = fn(index, (tokens as any) as string[]);
      return candidates.concat(v as never[]);
    } catch (e) {
      console.error("Auto-complete error:", e);
      return candidates;
    }
  }, []);

  // Filter only the ones starting with the expression
  return all.filter(txt => (txt as string).startsWith(expr as string));
}
