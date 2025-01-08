import { ENABLE_EVENT_THRESHOLD, LUCKY_PROMOTION, SUGGEST_PROMOTION } from './config.js';
import {
  calculateDiscountedPrice,
  createPeriodicEvent,
  findSuggestItem,
  getRandomItem
} from './lib.js';
import { STOCK } from '../../shared/lib/stock/config.js';

export const createPromotionEvents = ({ products, selectedProductId, onItemDiscount}) => {
  const createLuckyEvent = () => {
    const handleLuckyEvent = () => {
      if(Math.random() >= ENABLE_EVENT_THRESHOLD){
        return;
      }
      const luckyItem = getRandomItem(products);
      if(!luckyItem || luckyItem.quantity === STOCK.EMPTY){
        return;
      }

      const newPrice = calculateDiscountedPrice(luckyItem.price, LUCKY_PROMOTION.DISCOUNT_RATE);

      onItemDiscount({
        item: luckyItem,
        newPrice,
        message: `번개세일! ${luckyItem.name}이(가) 20% 할인 중입니다!`
      });
    };
    return createPeriodicEvent({
      callback: handleLuckyEvent,
      initialDelay: LUCKY_PROMOTION.TIMEOUT_DELAY,
      intervalDelay: LUCKY_PROMOTION.INTERVAL_DELAY,
    });
  };

  const createSuggestEvent = () => {
    const handleSuggestEvent = () => {
      if(!selectedProductId){
        return;
      }
      const suggestedItem = findSuggestItem(products, selectedProductId);
      if(!suggestedItem){
        return;
      }
      const newPrice = calculateDiscountedPrice(suggestedItem.price, SUGGEST_PROMOTION.DISCOUNT_RATE);

      onItemDiscount({
        item: suggestedItem,
        newPrice,
        message: `${suggestedItem.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`
      })
    };

    return createPeriodicEvent({
      callback: handleSuggestEvent,
      initialDelay: SUGGEST_PROMOTION.TIMEOUT_DELAY,
      intervalDelay: SUGGEST_PROMOTION.INTERVAL_DELAY,
    });
  };

  return {
    luckyEvent: createLuckyEvent,
    suggestEvent: createSuggestEvent,
  }
};