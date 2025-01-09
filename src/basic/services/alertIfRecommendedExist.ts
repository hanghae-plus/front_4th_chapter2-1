import { Product } from '../types/product';

export const alertIfRecommendedExist = (recommendedProduct?: Product) => {
  if (recommendedProduct) {
    alert(recommendedProduct.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!');
  }
};
