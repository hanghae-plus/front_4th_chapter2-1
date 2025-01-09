import { productList } from "advanced/constants/productList";
import { useCallback, useEffect, useReducer } from "react";
import {
  ALERT_MESSAGES,
  DISCOUNT_RATES,
  INITIAL_QTY,
} from "advanced/constants";
import { cartReducer } from "advanced/state/cartReducer";
import { Product } from "advanced/models/Product";

export const useCart = () => {
  const [cartState, dispatch] = useReducer(cartReducer, {
    items: [],
    lastSelectedItem: null,
  });

  // 임의의 시간마다 깜짝세일 20%
  const setSurpriseSale = useCallback(() => {
    const luckyItem =
      productList[Math.floor(Math.random() * productList.length)];

    if (
      Math.random() < DISCOUNT_RATES.SURPRISE_SALE &&
      luckyItem.remaining > 0
    ) {
      luckyItem.price = Math.round(
        luckyItem.price * DISCOUNT_RATES.SURPRISE_SALE
      );

      alert(ALERT_MESSAGES.SURPRISE_SALE(luckyItem.name));
    }
  }, []);

  // 추천세일 5%
  const setRecommendSale = useCallback(() => {
    if (cartState.lastSelectedItem) {
      const suggest = productList.find(
        (item) => item.id !== cartState.lastSelectedItem && item.remaining > 0
      );

      if (suggest) {
        alert(ALERT_MESSAGES.RECOMMENDED_SALE(suggest.name));

        suggest.price = Math.round(
          suggest.price * DISCOUNT_RATES.RECOMMENDED_SALE
        );
      }
    }
  }, [cartState.lastSelectedItem]);

  useEffect(() => {
    const createEventSale = (
      callback: () => void,
      interval: number,
      delay: number
    ) => {
      const timeoutId = setTimeout(() => {
        setInterval(callback, interval);
      }, Math.random() * delay);

      return timeoutId; // 타이머 ID 반환
    };

    const surpriseTimeout = createEventSale(setSurpriseSale, 30000, 10000);
    const recommendTimeout = createEventSale(setRecommendSale, 60000, 20000);

    return () => {
      clearTimeout(surpriseTimeout); // 타임아웃 정리
      clearInterval(recommendTimeout); // 인터벌 정리
    };
  }, [setSurpriseSale, setRecommendSale]);

  const addItem = (product: Product) =>
    dispatch({
      type: "ADD_ITEM",
      product: {
        ...product,
        qty: INITIAL_QTY,
        remaining: product.remaining,
      },
    });

  const changeQty = (id: string, change: number) =>
    dispatch({ type: "CHANGE_QTY", id, change });

  const removeItem = (id: string) => dispatch({ type: "REMOVE_ITEM", id });

  return {
    cartState,
    addItem,
    changeQty,
    removeItem,
  };
};
