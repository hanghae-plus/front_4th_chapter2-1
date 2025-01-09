import { useEffect, useCallback } from 'react';

import type { Product } from '../../../types/product';

const RECOMMEND_DISCOUNT_RATE = 0.95;

export const useRecommendProduct = (
  productList: Product[],
  setProductList: React.Dispatch<React.SetStateAction<Product[]>>,
  lastSaleItem: Product | null,
) => {
  const recommendProduct = useCallback(() => {
    if (!lastSaleItem) return;

    const suggestion = productList.find((item) => item.id !== lastSaleItem.id && item.quantity > 0);

    if (suggestion) {
      alert(`${suggestion.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);

      const discountedAmount = Math.round(suggestion.amount * RECOMMEND_DISCOUNT_RATE);
      const newProductList = productList.map((product) =>
        product.id === suggestion.id ? { ...product, amount: discountedAmount } : product,
      );

      setProductList(newProductList);
    }
  }, [lastSaleItem, productList, setProductList]);

  useEffect(() => {
    const initialDelay = Math.random() * 20000;
    const recommendationInterval = 60000;

    const timeoutId = setTimeout(() => {
      const intervalId = setInterval(recommendProduct, recommendationInterval);
      return () => clearInterval(intervalId);
    }, initialDelay);

    return () => clearTimeout(timeoutId);
  }, [recommendProduct]);
};
