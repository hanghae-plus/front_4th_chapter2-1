import { productList, SALE_PROBABILITY } from '../constant/product';

export function startDelayedInterval(callback, intervalTime, maxDelay) {
  setTimeout(function () {
    setInterval(function () {
      callback();
    }, intervalTime);
  }, Math.random() * maxDelay);
}

export function handleLuckyItemSale() {
  const luckyProduct = productList.find(
    (product) => product.price > Math.random()
  );
  if (luckyProduct) {
    alert(`${luckyProduct.name}이(가) 행운 상품으로 할인되었습니다!`);
    luckyProduct.price = luckyProduct.price * (1 - SALE_PROBABILITY);
    //updateCartTotal(cart);
  }
}

export function handleProductSuggestions() {
  const suggestedProduct =
    productList[Math.floor(Math.random() * productList.length)];
  alert(`${suggestedProduct.name}을 추천합니다!`);
}
