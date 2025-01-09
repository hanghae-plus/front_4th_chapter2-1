import {
  FLASH_SALE_INTERVAL,
  SUGGESTION_INTERVAL,
  FLASH_SALE_INITIAL_DELAY,
  SUGGESTION_INITIAL_DELAY,
} from "../../constants/promotion";
import { cartStore, productStore } from "../../store";

export const setupPromotion = () => {
  setupFlashSale();
  setupSuggestion();
};

const setupFlashSale = () => {
  setTimeout(() => {
    setInterval(() => {
      if (Math.random() < 0.3) {
        const products = productStore.get("products");
        const availableProducts = products.filter(
          (product) => product.stock > 0,
        );

        if (availableProducts.length > 0) {
          const flashSaleProduct =
            availableProducts[
              Math.floor(Math.random() * availableProducts.length)
            ];

          productStore.set("discountInformation", {
            isFlashSale: true,
            flashSaleProductId: flashSaleProduct.id,
          });

          alert(`번개세일! ${flashSaleProduct.name}이(가) 20% 할인 중입니다!`);
        }
      }
    }, FLASH_SALE_INTERVAL);
  }, Math.random() * FLASH_SALE_INITIAL_DELAY);
};

const setupSuggestion = () => {
  setTimeout(() => {
    setInterval(() => {
      const lastSelectedProduct = cartStore.get("lastSelected");

      if (lastSelectedProduct) {
        const products = productStore.get("products");
        const suggestedProduct = products.find(
          (product) => product.id !== lastSelectedProduct && product.stock > 0,
        );

        if (suggestedProduct) {
          productStore.set("discountInformation", {
            suggestedProductId: suggestedProduct.id,
          });

          alert(
            `${suggestedProduct.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`,
          );
        }
      }
    }, SUGGESTION_INTERVAL);
  }, Math.random() * SUGGESTION_INITIAL_DELAY);
};
