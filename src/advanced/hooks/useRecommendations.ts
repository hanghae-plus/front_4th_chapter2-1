import { useEffect } from "react";
import { CONSTANTS, Product } from "../config/constans";

// 상품 추천 기능
const useRecommendations = (
  products: Product[], 
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>, // 상품 상태를 업데이트하는 함수
  lastPickProduct: string | null // 사용자가 최근 선택한 상품 ID
) => {
  useEffect(() => {
    // 1분마다 상품 추천을 위한 타이머 설정
    const recommendTimer = setInterval(() => {
      if (lastPickProduct) {
        setProducts(prev => {
          // 1. 추천할 상품을 찾음 (최근 선택한 상품 제외, 재고가 있는 상품만)
          const recommendedItem = prev.find(
            item => item.id !== lastPickProduct && item.quantity > 0
          );

          // 2. 추천할 상품이 있는 경우
          if (recommendedItem) {
            // 상품 목록을 복사하여 새로운 배열 생성 (불변성 유지)
            const newProducts = [...prev];

            // 추천 상품의 인덱스를 찾음
            const itemIndex = newProducts.findIndex((item) => item.id === recommendedItem.id);

            // 추천 상품의 가격을 할인 (CONSTANTS.SUGGEST_DISCOUNT에 따라)
            newProducts[itemIndex].price = Math.floor(
              newProducts[itemIndex].price * (1 - CONSTANTS.SUGGEST_DISCOUNT)
            );

            alert(`${recommendedItem.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);
            return newProducts;
          }
          return prev;
        });
      }
    }, 60000);

    // 컴포넌트가 언마운트되거나 의존성이 변경될 때 타이머 정리
    return () => clearInterval(recommendTimer);
  }, [products, setProducts, lastPickProduct]); // 의존성: 상품 목록, 상태 업데이트 함수, 최근 선택한 상품
};

export default useRecommendations;