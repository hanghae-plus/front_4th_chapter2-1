import { Product } from "../models/Product";
import { INITIAL_QUANTITY } from "advanced/constants";

export type CartItem = Product & { quantity: number };

interface CartState {
  items: CartItem[];
  lastSelectedItem: string | null;
}

type CartAction =
  | { type: "ADD_ITEM"; product: CartItem }
  | { type: "CHANGE_QUANTITY"; id: string; change: number }
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
