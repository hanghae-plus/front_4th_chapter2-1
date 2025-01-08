import { useReducer } from "react";
import { Product } from "../models/Product";
import { INITIAL_QUANTITY } from "advanced/constants";

export type CartItem = Product & { quantity: number };

interface CartState {
  items: CartItem[];
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

    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.id),
      };

    default:
      return state;
  }
};

export const useCart = () => {
  const [cartState, dispatch] = useReducer(cartReducer, { items: [] });

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
