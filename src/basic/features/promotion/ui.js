import { createPromotionEvents } from './events.js';
import { updateSelectedOptions } from '../product-select/ui.js';

export const handlePromotionDiscount = ({ item, newPrice, message, updateUI }) => {
  item.price = newPrice;
  alert(message);
  updateUI();
};

export const initializePromotions = (selectProductElement, products, selectedProductId) => {
  const promotionEvents = createPromotionEvents({
    products,
    selectedProductId,
    onItemDiscount: ({ item, newPrice, message }) => {
      handlePromotionDiscount({
        item,
        newPrice,
        message,
        updateUI: () => {
          updateSelectedOptions(selectProductElement, products);
        },
      })
    }
  });

  const cleanupLuckEvent = promotionEvents.luckyEvent();
  const cleanupSuggestEvent = promotionEvents.suggestEvent();

  return () => {
    cleanupLuckEvent();
    cleanupSuggestEvent();
  };
};