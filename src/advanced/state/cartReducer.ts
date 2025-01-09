import { Product } from "../models/Product";
import { INITIAL_QTY } from "advanced/constants";

export type CartItem = Product & { qty: number };

interface CartState {
  items: CartItem[];
  lastSelectedItem: string | null;
}

type CartAction =
  | { type: "ADD_ITEM"; product: CartItem }
  | { type: "CHANGE_QTY"; id: string; change: number }
  | { type: "REMOVE_ITEM"; id: string };

export const cartReducer = (
  state: CartState,
  action: CartAction
): CartState => {
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
                  qty: item.qty + 1,
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
            qty: INITIAL_QTY,
            remaining: action.product.remaining - INITIAL_QTY,
          },
        ],
      };
    }

    case "CHANGE_QTY": {
      const itemToChange = state.items.find((item) => item.id === action.id);
      if (!itemToChange) return state;

      if (action.change > 0 && itemToChange.remaining < action.change) {
        alert("재고가 부족합니다.");
        return state;
      }

      state.lastSelectedItem = action.id;

      // 장바구니 잔여 수량 1에서 1감소 시 장바구니에서 삭제
      if (itemToChange.qty === 1 && action.change === -1) {
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
                qty: item.qty + action.change,
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
