interface Options {
  delay: number;
  interval: number;
}

export const setLazyInterval = (callback: () => void, { delay, interval }: Options) => {
  return setTimeout(() => {
    setInterval(callback, interval);
  }, delay);
};
