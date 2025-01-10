export function startDelayedInterval(callback, intervalTime, maxDelay) {
  setTimeout(function () {
    setInterval(function () {
      callback();
    }, intervalTime);
  }, Math.random() * maxDelay);
}
