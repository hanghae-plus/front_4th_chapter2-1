import { Product } from '../types/product';
import { Discount } from '../constants/discount-contants.ts';

export const applyRecommendDiscount = (productList: Product[], id: string) => {
  return productList.map((product) => {
    if (product.id === id && product.q > 0) {
      return {
        ...product,
        val: Math.round(product.val * (1 - Discount.Recommend)),
      };
    }
    return product;
  });
};
