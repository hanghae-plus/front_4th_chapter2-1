import { useProducts } from './useProduct.js';

let instance = null;

export function usePromotion() {
  if (instance) return instance;

  let promotions = [];

  const createPromotionInterval = (config) => {
    return setInterval(() => {
      const { getProducts, updatePrice } = useProducts();

      const products = getProducts();
      const availableProducts = products.filter(config.condition);
      if (!availableProducts.length) return;

      if (Math.random() < config.chance) {
        const randomProduct = getRandomProduct(availableProducts);
        const discountPrice = Math.round(randomProduct.price * (1 - config.priceRate));
        updatePrice(randomProduct.id, discountPrice);
        alert(config.getMessage(randomProduct));
      }
    }, config.interval);
  };

  const getRandomProduct = (availableProducts) => {
    return availableProducts[Math.floor(Math.random() * availableProducts.length)];
  };

  const startPromotion = (config) => {
    const timeout = setTimeout(() => {
      const interval = createPromotionInterval(config);
      promotions.push({ id: config.id, interval });
    }, config.delay);
    promotions.push({ id: config.id, timeout });
  };

  const stopPromotion = (config) => {
    const promotion = promotions.find((p) => p.id === config.id);
    if (promotion) {
      clearTimeout(promotion.timeout);
      clearInterval(promotion.interval);
      promotions = promotions.filter((p) => p.id !== config.id);
    }
  };

  instance = {
    startPromotion,
    stopPromotion,
  };

  return instance;
}
