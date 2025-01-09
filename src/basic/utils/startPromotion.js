/**
 * 프로모션 실행 함수 - startDelay 시간 후에 action을 interval 시간마다 실행
 * @param {*} action
 * @param {*} interval
 * @param {*} delay
 * @returns {void}
 */
export function startPromotion(action, interval, delay) {
  const startDelay = Math.random() * delay;

  setTimeout(() => {
    setInterval(action, interval);
  }, startDelay);
}
