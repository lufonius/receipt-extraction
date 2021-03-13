export const waitFor = async (
  predicate: () => boolean,
  timeoutMs: number = 2000,
  stepTimeMs: number = 50
): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    let timeSpentMs = 0;

    const interval = setInterval(() => {
      const limitReached = timeSpentMs > timeoutMs;

      if (limitReached || predicate()) {
        if (limitReached) {
          reject();
        } else {
          clearInterval(interval);
          resolve();
        }
      } else {
        timeSpentMs += stepTimeMs;
      }
    }, stepTimeMs);
  });
};
