const DISCOUNT_PROBABILITY = 0.3;
const DISCOUNT_RATE = 0.8;
const SALE_INTERVAL = 30000;
const INITIAL_DELAY = Math.random() * 10000;

const getRandomItem = (products, randomFn = Math.random) => {
  return products[Math.floor(randomFn() * products.length)];
};

const applyDiscount = (item) => {
  item.value = Math.round(item.value * DISCOUNT_RATE);
};

const showAlert = (message) => {
  alert(message);
};

const shouldApplyDiscount = (probability, randomFn = Math.random) => {
  return randomFn() < probability;
};

export const startLuckySale = (products, updateCallback, randomFn = Math.random) => {
  setTimeout(() => {
    setInterval(() => {
      const luckyItem = getRandomItem(products);
      if (shouldApplyDiscount(DISCOUNT_PROBABILITY, randomFn) && luckyItem.quantity > 0) {
        applyDiscount(luckyItem);
        showAlert(`번개세일! ${luckyItem.name}이(가) 20% 할인 중입니다!`);
        updateCallback();
      }
    }, SALE_INTERVAL);
  }, INITIAL_DELAY);
};
