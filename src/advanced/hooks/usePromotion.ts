import { useEffect } from "react";
import { useProduct } from "../contexts/ProductContext";
import {
  FLASH_SALE_INTERVAL,
  SUGGESTION_INTERVAL,
  FLASH_SALE_INITIAL_DELAY,
  SUGGESTION_INITIAL_DELAY,
} from "../constants";

export const usePromotion = () => {
  const { productState, setProductState } = useProduct();

  useEffect(() => {
    let flashSaleTimer: ReturnType<typeof setTimeout>;
    let suggestionTimer: ReturnType<typeof setTimeout>;
    let flashSaleInterval: ReturnType<typeof setInterval>;
    let suggestionInterval: ReturnType<typeof setInterval>;

    // Flash Sale 설정
    const setupFlashSale = () => {
      const randomProductIndex = Math.floor(
        Math.random() * productState.products.length
      );
      const selectedProduct = productState.products[randomProductIndex];

      if (selectedProduct.stock > 0) {
        setProductState((prev) => ({
          ...prev,
          discountInformation: {
            ...prev.discountInformation,
            isFlashSale: true,
            flashSaleProductId: selectedProduct.id,
          },
        }));

        // Flash Sale 알림
        alert(`번개세일! ${selectedProduct.name}이(가) 20% 할인 중입니다!`);

        // 30초 후 Flash Sale 종료
        setTimeout(() => {
          setProductState((prev) => ({
            ...prev,
            discountInformation: {
              ...prev.discountInformation,
              isFlashSale: false,
              flashSaleProductId: null,
            },
          }));
        }, FLASH_SALE_INTERVAL);
      }
    };

    // 추천 상품 설정
    const setupSuggestion = () => {
      const availableProducts = productState.products.filter(
        (product) => product.stock > 0
      );
      if (availableProducts.length === 0) return;

      const randomIndex = Math.floor(Math.random() * availableProducts.length);
      const suggestedProduct = availableProducts[randomIndex];

      setProductState((prev) => ({
        ...prev,
        discountInformation: {
          ...prev.discountInformation,
          suggestedProductId: suggestedProduct.id,
        },
      }));

      // 추천 상품 알림
      alert(
        `${suggestedProduct.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`
      );

      // 60초 후 추천 상품 제거
      setTimeout(() => {
        setProductState((prev) => ({
          ...prev,
          discountInformation: {
            ...prev.discountInformation,
            suggestedProductId: null,
          },
        }));
      }, SUGGESTION_INTERVAL);
    };

    // 초기 타로모션 설정
    const initializePromotions = () => {
      flashSaleTimer = setTimeout(() => {
        setupFlashSale();
        flashSaleInterval = setInterval(setupFlashSale, FLASH_SALE_INTERVAL);
      }, FLASH_SALE_INITIAL_DELAY);

      suggestionTimer = setTimeout(() => {
        setupSuggestion();
        suggestionInterval = setInterval(setupSuggestion, SUGGESTION_INTERVAL);
      }, SUGGESTION_INITIAL_DELAY);
    };

    initializePromotions();

    // 클린업 함수
    return () => {
      clearTimeout(flashSaleTimer);
      clearTimeout(suggestionTimer);
      clearInterval(flashSaleInterval);
      clearInterval(suggestionInterval);
    };
  }, []); // 컴포넌트 마운트 시 한 번만 실행
};
