// Utility functions

export const assert = (cond: boolean, message: string) => {
  if (!cond) {
    throw new Error(message);
  }
};
