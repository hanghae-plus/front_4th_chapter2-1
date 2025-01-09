export const promotionConfig = {
  flash: {
    id: 'flash-sale',
    delay: Math.random() * 10000,
    interval: 30000,
    condition: (product) => product.quantity > 0,
    chance: 0.3,
    getMessage: (product) => `번개세일! ${product.name}이(가) 20% 할인 중입니다!`,
    priceRate: 0.2,
  },
  suggestion: {
    id: 'suggestion-sale',
    delay: Math.random() * 20000,
    interval: 30000,
    chance: 1,
    condition: (product, selectedProductId) =>
      product.id !== selectedProductId && product.quantity > 0,
    getMessage: (product) => `${product.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`,
    priceRate: 0.05,
  },
};
