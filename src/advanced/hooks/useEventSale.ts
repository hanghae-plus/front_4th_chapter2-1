import { useEffect } from "react";
import { CONSTANTS, Product } from "../config/constans";

// 랜덤 상품 번개세일
const useEventSale = (
  products: Product[], 
  setProducts: React.Dispatch<React.SetStateAction<Product[]>> // 상품 상태를 업데이트하는 함수
) => {
  useEffect(() => {
    // 30초마다 실행되는 타이머 생성
    const eventSaleTimer = setInterval(() => {
      setProducts(prev => {
        // 랜덤으로 상품 인덱스 선택
        const luckyItemIndex = Math.floor(Math.random() * prev.length);

        // 일정 확률(CONSTANTS.SALE_CHANCE)로 세일 적용
        if (Math.random() < CONSTANTS.SALE_CHANCE && prev[luckyItemIndex].quantity > 0) {
          const newProducts = [...prev];
          const luckyItem = newProducts[luckyItemIndex];

          // 상품 가격에 세일 할인율 적용
          luckyItem.price = Math.round(luckyItem.price * (1 - CONSTANTS.SALE_DISCOUNT));

          alert(`번개세일! ${luckyItem.name}이(가) 20% 할인 중입니다!`);
          return newProducts;
        }

        return prev; // 변경이 없는 경우 기존 상품 배열 반환
      });
    }, 30000);

    // 컴포넌트가 언마운트될 때 타이머 정리
    return () => clearInterval(eventSaleTimer);
  }, [setProducts]); // setProducts에 의존

};

export default useEventSale;