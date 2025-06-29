declare const setTimeout: (callback: () => void, ms: number) => any;

export const sleep = (sleepMs: number): Promise<void> => {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, sleepMs);
  });
}; 