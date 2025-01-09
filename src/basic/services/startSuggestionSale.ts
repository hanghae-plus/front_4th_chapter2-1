import { renderSelectOptions } from '../components/renderer/renderer';

import type { Product } from '../types/product.type';

const SUGGESTION_SALE = {
  INTERVAL: 60000,
  INITIAL_DELAY: 20000,
  DISCOUNT_RATE: 0.95,
} as const;

function findSuggestion(products: Product[], lastSelectedId: string | null): Product | undefined {
  return products.find((item) => item.id !== lastSelectedId && item.quantity > 0);
}

function applySuggestionDiscount(item: Product) {
  item.originalPrice = Math.round(item.originalPrice * SUGGESTION_SALE.DISCOUNT_RATE);
}

export const startSuggestionSale = (products: Product[], getLastSelected: () => string | null) => {
  const applySuggestionSaleDiscount = () => {
    const lastSelectedId = getLastSelected();

    if (!lastSelectedId) return;

    const suggestion = findSuggestion(products, lastSelectedId);

    if (suggestion) {
      applySuggestionDiscount(suggestion);
      alert(suggestion.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!');
      renderSelectOptions(products);
    }
  };

  setTimeout(() => {
    setInterval(applySuggestionSaleDiscount, SUGGESTION_SALE.INTERVAL);
  }, Math.random() * SUGGESTION_SALE.INITIAL_DELAY);
};
