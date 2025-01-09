const DISCOUNT_RATE = 0.95;
const INITIAL_DELAY = Math.random() * 20000;
const COMMERCIAL_INTERVAL = 60000;

const findAlternativeProduct = (products, excludedProductId) => {
  return products.find((item) => item.id !== excludedProductId && item.quantity > 0);
};

const applyAdditionalDiscount = (product, discountRate) => {
  product.value = Math.round(product.value * discountRate);
};

const suggestProduct = (suggest, updateCallback) => {
  alert(`${suggest.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);
  applyAdditionalDiscount(suggest, DISCOUNT_RATE);
  updateCallback(); // 제품 옵션을 업데이트
};

export const startCommercialSale = (products, lastSelectedProduct, updateCallback) => {
  setTimeout(() => {
    setInterval(() => {
      if (lastSelectedProduct) {
        // 가장 최근에 구매한 아이템 광고
        const suggest = findAlternativeProduct(products, lastSelectedProduct);
        if (suggest) {
          suggestProduct(suggest, updateCallback);
        }
      }
    }, COMMERCIAL_INTERVAL);
  }, INITIAL_DELAY);
};
