import { Product } from '../../../shared/entity/model/Product';

const luckyAlert = (products: Product[], callback) => {
  return new Promise(() => {
    setTimeout(function () {
      setInterval(function () {
        const luckyItem = products[Math.floor(Math.random() * products.length)];
        if (Math.random() < 0.3 && luckyItem.quantity > 0) {
          luckyItem.price = Math.round(luckyItem.price * 0.8);
          alert('번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!');
          callback();
        }
      }, 30000);
    }, Math.random() * 10000);
  });
};

export { luckyAlert };
