import { useState, useEffect } from "react";
import { CONSTANTS } from "../config/constans";

interface CartItem {
  id: string;
  price: number;
  quantity: number;
}

interface DiscountedProduct {
  id: string;
  discountRate: number;
  originalAmount: number;
  discountedAmount: number;
}

interface DiscountStatus {
  dayDiscountApplied: boolean;
  bulkDiscountApplied: boolean;
  quantityDiscount: boolean;
  discountedProducts: DiscountedProduct[];
  totalOriginalAmount: number;
  totalDiscountedAmount: number;
}

const useCalculations = (cartItems: Record<string, CartItem>) => {
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [bonusPoints, setBonusPoints] = useState<number>(0);
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
      let totalItems = 0;
      let totalOriginalAmount = 0;
      let totalDiscountedAmount = 0;
      const discountedProducts: DiscountedProduct[] = [];

      Object.values(cartItems).forEach(item => {
        totalItems += item.quantity;
      });

      let effectDiscountRate = 0;
      const currentDay = new Date().getDay();
      const dayDiscount = currentDay === CONSTANTS.DAY_DISCOUNT_RATE;
      const bulkDiscount = totalItems >= 30;

      if (bulkDiscount) {
        effectDiscountRate = CONSTANTS.BULK_DISCOUNT_RATE;
      }

      if (dayDiscount) {
        effectDiscountRate = Math.max(effectDiscountRate, CONSTANTS.DAY_DISCOUNT_RATE);
      }

      Object.entries(cartItems).forEach(([id, item]) => {
        const itemSubTotal = item.price * item.quantity;
        let itemDiscountRate = effectDiscountRate;

        if (item.quantity >= 10) {
          const productDiscountRate = CONSTANTS.DISCOUNT_RATES[id] || 0;
          itemDiscountRate = Math.max(itemDiscountRate, productDiscountRate);
        }
        
        const itemDiscountedAmount = itemSubTotal * (1 - itemDiscountRate);

        totalOriginalAmount += itemSubTotal;
        totalDiscountedAmount += itemDiscountedAmount;

        if (itemDiscountRate > 0) {
          discountedProducts.push({
            id,
            discountRate: itemDiscountRate,
            originalAmount: itemSubTotal,
            discountedAmount: itemDiscountedAmount
          });
        }
      });

      setTotalAmount(Math.round(totalDiscountedAmount));
      setBonusPoints(Math.floor(totalDiscountedAmount / CONSTANTS.BONUS_POINT_DIVISOR));
      setDiscountStatus({ 
        dayDiscountApplied: dayDiscount,
        bulkDiscountApplied: bulkDiscount,
        quantityDiscount: discountedProducts.some(p => p.discountRate > effectDiscountRate),
        discountedProducts,
        totalOriginalAmount,
        totalDiscountedAmount,
      });
    };

    calculateTotal();
  }, [cartItems]);

  return { totalAmount, bonusPoints, discountStatus };
};

export default useCalculations;