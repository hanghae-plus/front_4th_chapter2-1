import { initialProductList } from '../data/initialProductList';
import { ProductListType, ProductType } from '../types/ProductType';

export const ACTION_TYPES = {
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  INCREASE_CART_ITEM: 'INCREASE_CART_ITEM',
  DECREASE_CART_ITEM: 'DECREASE_CART_ITEM',
  REMOVE_CART_ITEM: 'REMOVE_CART_ITEM',
  SET_LAST_SELECTED: 'SET_LAST_SELECTED',
} as const;

export interface ProductState {
  cartList: ProductListType;
  productList: ProductListType;
  lastSelectedItem: string;
}

type ProductActionType =
  | {
      type: typeof ACTION_TYPES.UPDATE_QUANTITY;
      payload: { productId: string; quantityChange: number };
    }
  | {
      type: typeof ACTION_TYPES.SET_LAST_SELECTED;
      payload: { productId: string };
    }
  | {
      type: typeof ACTION_TYPES.INCREASE_CART_ITEM;
      payload: { productId: string };
    }
  | {
      type: typeof ACTION_TYPES.DECREASE_CART_ITEM;
      payload: { productId: string };
    }
  | {
      type: typeof ACTION_TYPES.REMOVE_CART_ITEM;
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
        cartList: state.cartList.some((product) => product.id === action.payload.productId)
          ? state.cartList.map((product) =>
              product.id === action.payload.productId
                ? { ...product, quantity: product.quantity - action.payload.quantityChange }
                : product,
            )
          : [
              ...state.cartList,
              {
                ...state.productList.find((product) => product.id === action.payload.productId),
                quantity: 1,
              } as ProductType,
            ],
      };
    case ACTION_TYPES.SET_LAST_SELECTED: // 마지막 선택한 상품 설정
      return {
        ...state,
        lastSelectedItem: action.payload.productId,
      };
    case ACTION_TYPES.INCREASE_CART_ITEM: // 장바구니 상품 수량 추가
      return {
        ...state,
        cartList: state.cartList.map((product) =>
          product.id === action.payload.productId
            ? { ...product, quantity: product.quantity + 1 }
            : product,
        ),
        productList: state.productList.map((product) =>
          product.id === action.payload.productId
            ? { ...product, quantity: product.quantity - 1 }
            : product,
        ),
      };
    case ACTION_TYPES.DECREASE_CART_ITEM: // 장바구니 상품 수량 감소
      return {
        ...state,
        cartList: state.cartList.map((product) =>
          product.id === action.payload.productId
            ? { ...product, quantity: product.quantity - 1 }
            : product,
        ),
        productList: state.productList.map((product) =>
          product.id === action.payload.productId
            ? { ...product, quantity: product.quantity + 1 }
            : product,
        ),
      };
    case ACTION_TYPES.REMOVE_CART_ITEM: // 장바구니 상품 삭제
      return {
        ...state,
        cartList: state.cartList.filter((product) => product.id !== action.payload.productId),
        productList: state.productList.map((product) =>
          product.id === action.payload.productId
            ? {
                ...product,
                quantity: initialProductList.find((p) => p.id === product.id)?.quantity || 0,
              }
            : product,
        ),
      };
    default:
      return state;
  }
}
