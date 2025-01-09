import { updateProductSelect } from '../components/ProductSelect';
import { DISCOUNT_POLICY, TIMER_POLICY } from '../constants/policy';
import { products } from '../data/products';

export const setupLightningSaleTimer = () => {
  setTimeout(() => {
    setInterval(handleLightningSale, TIMER_POLICY.LIGHTNING_SALE_INTERVAL);
  }, Math.random() * 10000);
};

export const setupRecommendationTimer = () => {
  setTimeout(() => {
    setInterval(handleRecommendation, TIMER_POLICY.PRODUCT_RECOMMENDATION_INTERVAL);
  }, Math.random() * 20000);
};

const handleLightningSale = () => {
  const luckyItem = products[Math.floor(Math.random() * products.length)];
  if (Math.random() < DISCOUNT_POLICY.LIGHTNING_SALE_PROBABILITY && luckyItem.quantity > 0) {
    luckyItem.price = Math.round(luckyItem.price * (1 - DISCOUNT_POLICY.LIGHTNING_SALE_RATE));
    alert(`번개세일! ${luckyItem.name}이(가) 20% 할인 중입니다!`);
    updateProductSelect();
  }
};

const handleRecommendation = () => {
  if (!productStore.getLastSelectedProduct()) {
    return;
  }

  const suggest = products.find((item) => item.id !== productStore.getLastSelectedProduct() && item.quantity > 0);

  if (suggest) {
    alert(`${suggest.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);
    suggest.price = Math.round(suggest.price * (1 - DISCOUNT_POLICY.RECOMMENDATION_DISCOUNT_RATE));
    updateProductSelect();
  }
};
