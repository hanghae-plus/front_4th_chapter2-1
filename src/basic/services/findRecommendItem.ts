import { Product } from '../types/product';

export const findRecommendItem = (productList: Product[], selectedId: string) => {
  return productList.find(function (item) {
    return item.id !== selectedId && item.q > 0;
  });
};
