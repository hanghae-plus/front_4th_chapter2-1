import { productData } from '../data/data.js';

export const startLightningSale = () => {
  setTimeout(function () {
    setInterval(function () {
      const luckyItem =
        productData[Math.floor(Math.random() * productData.length)];
      if (Math.random() < 0.3 && luckyItem.quantity > 0) {
        luckyItem.price = Math.round(luckyItem.price * 0.8);
        alert('번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!');
      }
    }, 30000);
  }, Math.random() * 10000);
};

export const startRecommendProduct = () => {
  setTimeout(function () {
    setInterval(function () {
      if (lastSel) {
        const suggest = productData.find(function (item) {
          return item.id !== lastSel && item.quantity > 0;
        });
        if (suggest) {
          alert(
            suggest.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!'
          );
          suggest.price = Math.round(suggest.price * 0.95);
        }
      }
    }, 60000);
  }, Math.random() * 20000);
};
