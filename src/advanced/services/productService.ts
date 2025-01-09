// productsReducer.ts
import type { Product } from '../types/product.type';

/** ProductsState: products가 가지고 있을 상태 정의 */
export interface ProductsState {
  items: Product[];
}

export type ProductsAction =
  | { type: 'INCREASE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'DECREASE_QUANTITY'; payload: { productId: string; quantity: number } };

/** productsReducer */
export function productsReducer(state: ProductsState, action: ProductsAction): ProductsState {
  switch (action.type) {
    case 'INCREASE_QUANTITY': {
      const { productId, quantity } = action.payload;

      return {
        ...state,
        items: state.items.map((item) =>
          item.id === productId ? { ...item, quantity: item.quantity + quantity } : item
        ),
      };
    }

    case 'DECREASE_QUANTITY': {
      const { productId, quantity } = action.payload;

      return {
        ...state,
        items: state.items.map((item) =>
          item.id === productId
            ? { ...item, quantity: Math.max(item.quantity - quantity, 0) }
            : item
        ),
      };
    }

    default:
      return state;
  }
}
