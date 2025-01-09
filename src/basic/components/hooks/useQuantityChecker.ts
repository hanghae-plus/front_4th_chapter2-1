import { ProductStore } from '../../store/productStore';

import type { Product } from '../../types/product';

export const isQuantityCountOver = (product: Product, compareTarget: number) => {
  const { actions } = ProductStore;

  const productList = actions.getProductList();

  const matchedItem = productList.find((item) => item.id === product.id);

  if (!matchedItem) return false;

  if (matchedItem.quantity === compareTarget) {
    alert('재고가 부족합니다.');
    return true;
  }

  return false;
};
