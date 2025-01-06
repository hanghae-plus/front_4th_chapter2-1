export const state = (() => {
  const data = {
    lastSel: null,
    bonusPoint: 0,
    totalAmt: 0,
    itemCnt: 0,
    prodList: [
      { id: 'p1', name: '상품1', price: 10000, volume: 50 },
      { id: 'p2', name: '상품2', price: 20000, volume: 30 },
      { id: 'p3', name: '상품3', price: 30000, volume: 20 },
      { id: 'p4', name: '상품4', price: 15000, volume: 0 },
      { id: 'p5', name: '상품5', price: 25000, volume: 10 }
    ]
  };

  const listeners = new Map();

  return {
    get(key) {
      return data[key];
    },
    set(key, value) {
      data[key] = value;

      if (listeners.has(key)) {
        listeners.get(key).forEach((callback) => callback(value));
      }
    },
    subscribe(key, callback) {
      if (!listeners.has(key)) {
        listeners.set(key, []);
      }
      listeners.get(key).push(callback);
    }
  };
})();
