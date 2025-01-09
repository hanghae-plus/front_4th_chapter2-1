import { useState, useEffect } from "react";
import { CONSTANTS } from "../config/constans";

interface CartItem {
  id: string;
  price: number;
  quantity: number;
}

interface DiscountedProduct {
  id: string;
  discountRate: number; // 해당 상품에 적용된 최종 할인율
  originalAmount: number; // 해당 상품의 원래 총 금액 (price * quantity)
  discountedAmount: number; // 해당 상품에 할인 적용 후 총 금액
}

interface DiscountStatus {
  dayDiscountApplied: boolean; // 요일별 할인 적용 여부
  bulkDiscountApplied: boolean; // 대량구매 할인 적용 여부
  quantityDiscount: boolean; // 개별할인 적용 여부
  discountedProducts: DiscountedProduct[]; // 각 상품별 할인 리스트
  totalOriginalAmount: number; // 모든 상품의 원래 총액
  totalDiscountedAmount: number; // 모든 상품의 할인적용 후 총액
}

const useCalculations = (cartItems: Record<string, CartItem>) => {
  // 총 결제 금액
  const [totalAmount, setTotalAmount] = useState<number>(0);

  // 보너스 포인트
  const [bonusPoints, setBonusPoints] = useState<number>(0);

  // 할인 상태
  const [discountStatus, setDiscountStatus] = useState<DiscountStatus>({
    dayDiscountApplied: false,
    bulkDiscountApplied: false,
    quantityDiscount: false,
    discountedProducts: [],
    totalOriginalAmount: 0,
    totalDiscountedAmount: 0,
  });

  useEffect(() => {
    const calculateTotal = () => {
      let totalItems = 0; // 장바구니 전체 상품 수량
      let totalOriginalAmount = 0; // 할인 전 전체 금액
      let totalDiscountedAmount = 0; // 할인 후 전체 금액
      const discountedProducts: DiscountedProduct[] = []; // 할인된 상품 리스트

      // 1. 장바구니에 있는 모든 상품의 수량 계산
      Object.values(cartItems).forEach(item => {
        totalItems += item.quantity;
      });

      // 2. 전체 할인율(effectDiscountRate) 결정
      let effectDiscountRate = 0;
      const currentDay = new Date().getDay();
      const dayDiscount = currentDay === CONSTANTS.DAY_DISCOUNT_RATE;
      const bulkDiscount = totalItems >= 30;

      // 대량구매 할인 적용
      if (bulkDiscount) {
        effectDiscountRate = CONSTANTS.BULK_DISCOUNT_RATE;
      }

      // 화요일 할인 적용
      if (dayDiscount) {
        effectDiscountRate = Math.max(effectDiscountRate, CONSTANTS.DAY_DISCOUNT_RATE);
      }

      // 3. 개별 상품의 할인율과 최종 금액 계산
      Object.entries(cartItems).forEach(([id, item]) => {
        const itemSubTotal = item.price * item.quantity; // 해당 상품의 원래 총 금액
        let itemDiscountRate = effectDiscountRate; // 기본 할인율로 초기화

        // 개별 상품 할인조건 확인
        if (item.quantity >= 10) {
          const productDiscountRate = CONSTANTS.DISCOUNT_RATES[id] || 0; // 상품별 할인율 가져오기
          itemDiscountRate = Math.max(itemDiscountRate, productDiscountRate); // 더 높은 할인율 적용
        }
        
        const itemDiscountedAmount = itemSubTotal * (1 - itemDiscountRate); // 할인 적용 후 금액 계산

        // 전체 합계 업데이트
        totalOriginalAmount += itemSubTotal;
        totalDiscountedAmount += itemDiscountedAmount;

        // 할인된 상품만 리스트에 추가
        if (itemDiscountRate > 0) {
          discountedProducts.push({
            id,
            discountRate: itemDiscountRate, // 적용된 최종 할인율
            originalAmount: itemSubTotal, // 원래 총 금액
            discountedAmount: itemDiscountedAmount // 할인 후 총 금액
          });
        }
      });

      // 4. 상태 업데이트
      setTotalAmount(Math.round(totalDiscountedAmount)); // 소수점 반올림
      setBonusPoints(Math.floor(totalDiscountedAmount / CONSTANTS.BONUS_POINT_DIVISOR)); // 보너스 포인트 계산
      setDiscountStatus({ 
        dayDiscountApplied: dayDiscount,
        bulkDiscountApplied: bulkDiscount,
        quantityDiscount: discountedProducts.some(p => p.discountRate > effectDiscountRate), // 상품수량 할인적용 여부
        discountedProducts,
        totalOriginalAmount,
        totalDiscountedAmount,
      });
    };

    calculateTotal();
  }, [cartItems]); // cartItem 변경될 때마다 다시 게산

  return { totalAmount, bonusPoints, discountStatus };
};

export default useCalculations;