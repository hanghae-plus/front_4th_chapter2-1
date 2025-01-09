import { useEffect, useCallback } from 'react';

import { RECOMMEND_DISCOUNT_RATE } from '../../../constants/discountRates';

import type { Product } from '../../../types/product';

const INITIAL_RECOMMENDATION_DELAY = 20000;
const RECOMMENDATION_INTERVAL = 60000;

interface UseRecommendProductProps {
  productList: Product[];
  setProductList: React.Dispatch<React.SetStateAction<Product[]>>;
  lastSaleItem: Product | null;
}

export const useRecommendProduct = ({ productList, setProductList, lastSaleItem }: UseRecommendProductProps) => {
  const recommendProduct = useCallback(() => {
    if (!lastSaleItem) return;

    const recommendedProduct = productList.find((item) => item.id !== lastSaleItem.id && item.quantity > 0);

    if (recommendedProduct) {
      alert(`${recommendedProduct.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);

      const discountedAmount = Math.round(recommendedProduct.amount * RECOMMEND_DISCOUNT_RATE);
      const updatedProductList = productList.map((product) =>
        product.id === recommendedProduct.id ? { ...product, amount: discountedAmount } : product,
      );

      setProductList(updatedProductList);
    }
  }, [lastSaleItem, productList, setProductList]);

  useEffect(() => {
    const initialDelay = Math.random() * INITIAL_RECOMMENDATION_DELAY;
    const recommendationInterval = RECOMMENDATION_INTERVAL;

    const timeoutId = setTimeout(() => {
      const intervalId = setInterval(recommendProduct, recommendationInterval);
      return () => clearInterval(intervalId);
    }, initialDelay);

    return () => clearTimeout(timeoutId);
  }, [recommendProduct]);
};
