import { ProductListType } from '../types/ProductType';

export const ACTION_TYPES = {
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  SET_LAST_SELECTED: 'SET_LAST_SELECTED',
} as const;

interface ProductState {
  productList: ProductListType;
  lastSelectedItem: string | null;
}

type ProductActionType =
  | {
      type: typeof ACTION_TYPES.UPDATE_QUANTITY;
      payload: { productId: string; quantityChange: number };
    }
  | {
      type: typeof ACTION_TYPES.SET_LAST_SELECTED;
      payload: { productId: string };
    };

/**
 * 상품 상태를 관리하는 리듀서 함수
 */
export function productReducer(state: ProductState, action: ProductActionType) {
  switch (action.type) {
    case ACTION_TYPES.UPDATE_QUANTITY: // 수량 변경
      return {
        ...state,
        productList: state.productList.map((product) =>
          product.id === action.payload.productId
            ? { ...product, quantity: product.quantity + action.payload.quantityChange }
            : product,
        ),
      };
    case ACTION_TYPES.SET_LAST_SELECTED: // 마지막 선택한 상품 설정
      return {
        ...state,
        lastSelectedItem: action.payload.productId,
      };
    default:
      return state;
  }
}
