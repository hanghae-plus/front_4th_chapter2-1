import { useEffect } from 'react';

import { useProducts } from '../stores/ProductContext';

import type { Product } from '../types/product.type';

const SUGGESTION_SALE = {
  INTERVAL: 60000,
  INITIAL_DELAY: 20000,
  DISCOUNT_RATE: 0.95,
} as const;

const findSuggestion = (products: Product[], lastSelectedId: string | null) => {
  return products.find((item) => item.id !== lastSelectedId && item.quantity > 0);
};

const applySuggestionDiscount = (item: Product) => {
  item.originalPrice = Math.round(item.originalPrice * SUGGESTION_SALE.DISCOUNT_RATE);
};

export const useSuggestionSale = (selectedItemId: string | null) => {
  const {
    state: { items },
  } = useProducts();

  const applySuggestionSaleDiscount = () => {
    const lastSelectedId = selectedItemId;

    if (!lastSelectedId) return;

    const suggestion = findSuggestion(items, lastSelectedId);

    if (suggestion) {
      applySuggestionDiscount(suggestion);
      alert(suggestion.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!');
    }
  };

  useEffect(() => {
    const initialTimeout = setTimeout(() => {
      const suggestionInterval = setInterval(applySuggestionSaleDiscount, SUGGESTION_SALE.INTERVAL);

      return () => {
        clearInterval(suggestionInterval);
      };
    }, Math.random() * SUGGESTION_SALE.INITIAL_DELAY);

    return () => {
      clearTimeout(initialTimeout);
    };
  }, [items, selectedItemId]);
};
