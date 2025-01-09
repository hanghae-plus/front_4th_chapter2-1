import { useGetProductList } from '../contexts/product-context/ProductContext';

import type { Product } from '../types/product';

export const useQuantityCountChecker = () => {
  const productList = useGetProductList();

  const isQuantityCountOver = (product: Product, compareTarget: number) => {
    const matchedItem = productList.find((item) => item.id === product.id);

    if (!matchedItem) return false;

    const isShowAlert = matchedItem.quantity === compareTarget;

    if (isShowAlert) {
      alert('재고가 부족합니다.');
      return true;
    }

    return false;
  };

  return { isQuantityCountOver };
};
