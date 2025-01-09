import { useEffect } from "react";
import { Product } from "../types";
import { PROMOTION_CONFIG } from "../constants";

export const usePromotion = (
  products: Product[],
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>,
  lastSelectedProduct: string | null
) => {
  useEffect(() => {
    // 번개세일
    const flashSaleConfig = PROMOTION_CONFIG.FLASH_SALE;
    const flashSaleTimer = setTimeout(() => {
      const interval = setInterval(() => {
        if (Math.random() < flashSaleConfig.PROBABILITY) {
          setProducts((prev) => {
            const availableProducts = prev.filter((p) => p.stock > 0);
            if (availableProducts.length === 0) return prev;

            const randomProduct =
              availableProducts[
                Math.floor(Math.random() * availableProducts.length)
              ];

            alert(`번개세일! ${randomProduct.name}이(가) 20% 할인 중입니다!`);

            return prev.map((p) =>
              p.id === randomProduct.id
                ? {
                    ...p,
                    price: Math.round(p.price * flashSaleConfig.DISCOUNT_RATE),
                  }
                : p
            );
          });
        }
      }, flashSaleConfig.INTERVAL);

      return () => clearInterval(interval);
    }, flashSaleConfig.INITIAL_DELAY);

    // 추천 프로모션
    const recConfig = PROMOTION_CONFIG.RECOMMENDATION;
    const recTimer = setTimeout(() => {
      const interval = setInterval(() => {
        if (lastSelectedProduct) {
          setProducts((prev) => {
            const availableProducts = prev.filter(
              (p) => p.id !== lastSelectedProduct && p.stock > 0
            );
            if (availableProducts.length === 0) return prev;

            const randomProduct =
              availableProducts[
                Math.floor(Math.random() * availableProducts.length)
              ];

            alert(
              `${randomProduct.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`
            );

            return prev.map((p) =>
              p.id === randomProduct.id
                ? { ...p, price: Math.round(p.price * recConfig.DISCOUNT_RATE) }
                : p
            );
          });
        }
      }, recConfig.INTERVAL);

      return () => clearInterval(interval);
    }, recConfig.INITIAL_DELAY);

    return () => {
      clearTimeout(flashSaleTimer);
      clearTimeout(recTimer);
    };
  }, [lastSelectedProduct]);
};
