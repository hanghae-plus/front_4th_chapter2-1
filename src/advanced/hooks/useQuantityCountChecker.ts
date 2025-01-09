import { useGetProductList } from '../contexts/product-context/ProductProvider';

import type { Product } from '../types/product';

export const useQuantityCountChecker = () => {
  const productList = useGetProductList();

  const isQuantityCountOver = (product: Product) => {
    const matchedItem = productList.find((item) => item.id === product.id);

    if (!matchedItem) return false;

    if (matchedItem.quantity === 0) {
      alert('재고가 부족합니다.');
      return true;
    }

    return false;
  };

  return { isQuantityCountOver };
};
