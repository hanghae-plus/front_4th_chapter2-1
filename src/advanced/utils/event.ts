import { DISCOUNT_RATE } from '../constants/discount';
import { PRODUCTS } from '../constants/products';

export const handleWowSaleAlert = (
  setProductList: React.Dispatch<React.SetStateAction<typeof PRODUCTS>>,
) => {
  const randomProduct = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];

  if (Math.random() < 0.3 && randomProduct.stockQuantity > 0) {
    randomProduct.price = Math.round(randomProduct.price * DISCOUNT_RATE.WOW_DISCOUNT);
    alert(`번개세일! ${randomProduct.name}이(가) 20%할인 중입니다!`);
    setProductList([...PRODUCTS]);
  }
};

export const handleRecommendedSaleAlert = (
  lastSelectedProduct: string,
  setProductList: React.Dispatch<React.SetStateAction<typeof PRODUCTS>>,
) => {
  if (!lastSelectedProduct) return;

  const recommendedProduct = PRODUCTS.find(
    (product) => product.id !== lastSelectedProduct && product.stockQuantity > 0,
  );

  if (recommendedProduct) {
    recommendedProduct.price = Math.round(
      recommendedProduct.price * DISCOUNT_RATE.RECOMMEND_DISCOUNT,
    );
    alert(`${recommendedProduct.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);
    setProductList([...PRODUCTS]);
  }
};
