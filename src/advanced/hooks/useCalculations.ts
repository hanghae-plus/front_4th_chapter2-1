import { useState, useEffect } from "react";
import { CONSTANTS } from "../config/constans";

interface CartItem {
  id: string;
  price: number;
  quantity: number;
}

interface DiscountStatus {
  dayDiscountApplied: boolean;
  bulkDiscountApplied: boolean;
  quantityDiscount: boolean;
}

const useCalculations = (cartItems: Record<string, CartItem>) => {
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [bonusPoints, setBonusPoints] = useState<number>(0);
  const [discountStatus, setDiscountStatus] = useState<DiscountStatus>({
    dayDiscountApplied: false,
    bulkDiscountApplied: false,
    quantityDiscount: false
  });

  useEffect(() => {
    const calculateTotal = () => {
      let subTotal = 0;
      let totalItems = 0;
      let quantityDiscount = false;
      let dayDiscountApplied = false;
      let bulkDiscountApplied = false;

      Object.entries(cartItems).forEach(([id, item]) => {
        const itemTotal = item.price * item.quantity;
        let discountRate = 0;
        
        if (item.quantity >= 10) {
          discountRate = CONSTANTS.DISCOUNT_RATES[id] || 0;
          quantityDiscount = true;
        }
        totalItems += item.quantity;
        subTotal += itemTotal * (1 - discountRate);
      });

      if (totalItems >= 30) {
        subTotal *= (1 - CONSTANTS.BULK_DISCOUNT_RATE);
        bulkDiscountApplied = true;
      }

      const currentDay = new Date().getDay();
      if (currentDay === CONSTANTS.DISCOUNT_DAY) {
        subTotal *= (1 - CONSTANTS.DAY_DISCOUNT_RATE);
        dayDiscountApplied = true;
      }

      setTotalAmount(Math.round(subTotal));
      setBonusPoints(Math.floor(subTotal / CONSTANTS.BONUS_POINT_DIVISOR));
      setDiscountStatus({ dayDiscountApplied, bulkDiscountApplied, quantityDiscount })
    };

    calculateTotal();
  }, [cartItems]);

  return { totalAmount, bonusPoints, discountStatus };
};

export default useCalculations;