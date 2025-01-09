import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { itemList } from "../constants/constants";
import { IItem } from "../types/types";

export interface CartTotalCost {
  totalCost: number;
  setTotalCost: Dispatch<SetStateAction<number>>;
  bonus: number;
  setBonus: Dispatch<SetStateAction<number>>;
  cart: IItem[];
}

export default function CartTotalCost(props: CartTotalCost) {
  const { totalCost, setTotalCost, bonus, setBonus, cart } = props;

  // const [tally, setTally] = useState<number>(0);
  const [discountRate, setDiscountRate] = useState<number>(0);
  let discRate: number = 0;

  useEffect(() => {
    const { discRate } = calculateCart();
    setDiscountRate(discRate);
  }, [cart]);

  const calculateCart = () => {
    let newTotalCost: number = 0;
    let newTally: number = 0;
    let subTot: number = 0;

    // 각 아이템별 계산
    cart.forEach((cartItem: IItem) => {
      const curItem = itemList.find((item: IItem) => item.id === cartItem.id);
      if (!curItem) return;

      const qty: number = cartItem.qty;
      const itemTot: number = curItem.price * qty;
      let disc: number = 0;

      newTally += qty;
      subTot += itemTot;

      // 수량 할인 계산
      if (qty >= 10) {
        const discounts: { [key: string]: number } = {
          p1: 0.1,
          p2: 0.15,
          p3: 0.2,
          p4: 0.05,
          p5: 0.25,
        };
        disc = discounts[curItem.id] || 0;
      }

      newTotalCost += itemTot * (1 - disc);
    });

    // 대량 구매 할인 계산

    if (newTally >= 30) {
      const bulkDisc: number = newTotalCost * 0.25;
      const itemDisc: number = subTot - newTotalCost;

      if (bulkDisc > itemDisc) {
        newTotalCost = subTot * 0.75;
        discRate = 0.25;
      } else {
        discRate = (subTot - newTotalCost) / subTot;
      }
    } else {
      discRate = (subTot - newTotalCost) / subTot;
    }

    // 화요일 할인
    if (new Date().getDay() === 2) {
      newTotalCost *= 0.9;
      discRate = Math.max(discRate, 0.1);
    }

    // 포인트 계산
    const newBonus: number = Math.floor(newTotalCost / 1000);

    setTotalCost(Math.round(newTotalCost));
    setBonus(newBonus);

    return { discRate };
  };

  return (
    <div id="cart-total" className="text-xl font-bold my-4">
      총액: {totalCost}원
      {discountRate > 0 && (
        <span className="text-green-500 ml-2">{`(${Math.round(discountRate * 100)}% 할인 적용)`}</span>
      )}
      <span className="text-blue-500 ml-2">(포인트: {bonus})</span>
      {/*<div className="text-sm mt-2">{renderStockStatus()}</div>*/}
    </div>
  );
}
