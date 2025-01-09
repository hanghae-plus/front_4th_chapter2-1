// cartReducer.ts
import type { Product } from '../types/product.type';

export interface CartState {
  items: Product[];
  lastSelectedId: string | null;
}

export type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: Product; quantity?: number } }
  | { type: 'DECREASE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: { productId: string } }
  | { type: 'CLEAR' };

export const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, quantity = 1 } = action.payload;
      const existingItem = state.items.find((item) => item.id === product.id);

      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
          ),
          lastSelectedId: product.id,
        };
      }

      return {
        ...state,
        items: [...state.items, { ...product, quantity }],
        lastSelectedId: product.id,
      };
    }

    case 'DECREASE_QUANTITY': {
      const { productId, quantity } = action.payload;
      const existingItem = state.items.find((item) => item.id === productId);

      if (!existingItem) return state;

      const newQuantity = existingItem.quantity - quantity;

      if (newQuantity <= 0) {
        // 수량이 0 이하가 되면 제거
        return {
          ...state,
          items: state.items.filter((item) => item.id !== productId),
        };
      }

      return {
        ...state,
        items: state.items.map((item) =>
          item.id === productId ? { ...item, quantity: newQuantity } : item
        ),
      };
    }

    case 'REMOVE_ITEM': {
      const { productId } = action.payload;

      return {
        ...state,
        items: state.items.filter((item) => item.id !== productId),
      };
    }

    case 'CLEAR':
      return {
        items: [],
        lastSelectedId: null,
      };

    default:
      return state;
  }
};
