import { useCallback, useEffect, useReducer } from "react";
import { Product } from "../models/Product";
import {
  ALERT_MESSAGES,
  DISCOUNT_RATES,
  INITIAL_QUANTITY,
} from "advanced/constants";
import { productList } from "advanced/store/productList";

export type CartItem = Product & { quantity: number };

interface CartState {
  items: CartItem[];
  lastSelectedItem: string | null;
}

type CartAction =
  | { type: "ADD_ITEM"; product: CartItem }
  | { type: "CHANGE_QUANTITY"; id: string; change: number }
  | { type: "REMOVE_ITEM"; id: string };

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItem = state.items.find(
        (item) => item.id === action.product.id
      );

      state.lastSelectedItem = action.product.id;

      if (existingItem) {
        if (existingItem.remaining <= 0) {
          alert("재고가 부족합니다.");
          return state;
        }

        return {
          ...state,
          items: state.items.map((item) =>
            item.id === action.product.id
              ? {
                  ...item,
                  quantity: item.quantity + 1,
                  remaining: item.remaining - 1,
                }
              : item
          ),
        };
      }

      // 상품이 장바구니에 없는 경우
      return {
        ...state,
        items: [
          ...state.items,
          {
            ...action.product,
            quantity: INITIAL_QUANTITY,
            remaining: action.product.remaining - INITIAL_QUANTITY,
          },
        ],
      };
    }

    case "CHANGE_QUANTITY": {
      const itemToChange = state.items.find((item) => item.id === action.id);
      if (!itemToChange) return state;

      if (action.change > 0 && itemToChange.remaining < action.change) {
        alert("재고가 부족합니다.");
        return state;
      }

      state.lastSelectedItem = action.id;

      // 장바구니 잔여 수량 1에서 1감소 시 장바구니에서 삭제
      if (itemToChange.quantity === 1 && action.change === -1) {
        return {
          ...state,
          items: state.items.filter((item) => item.id !== action.id),
        };
      }

      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.id
            ? {
                ...item,
                quantity: item.quantity + action.change,
                remaining: item.remaining - action.change,
              }
            : item
        ),
      };
    }

    case "REMOVE_ITEM": {
      state.lastSelectedItem = action.id;

      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.id),
      };
    }

    default:
      return state;
  }
};

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
        quantity: INITIAL_QUANTITY,
        remaining: product.remaining,
      },
    });

  const changeQuantity = (id: string, change: number) =>
    dispatch({ type: "CHANGE_QUANTITY", id, change });

  const removeItem = (id: string) => dispatch({ type: "REMOVE_ITEM", id });

  return {
    cartState,
    addItem,
    changeQuantity,
    removeItem,
  };
};
