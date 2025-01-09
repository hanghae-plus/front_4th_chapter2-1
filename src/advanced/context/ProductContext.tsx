import { createContext, PropsWithChildren, useCallback, useContext, useReducer } from 'react';
import { initialProductList } from '../data/initialProductList';
import { ProductListType, ProductType } from '../types/ProductType';
import { ACTION_TYPES, productReducer, ProductState } from './productReducer';

const initialState = {
  cartList: [] as ProductListType,
  productList: initialProductList,
  lastSelectedItem: initialProductList[0].id,
} as const;

interface ProductContextType extends ProductState {
  updateProductQuantity: (productId: string, quantityChange: number) => void;
  findProduct: (productId: string) => ProductType | undefined;
  setLastSelectedItem: (productId: string) => void;
  increaseCartItem: (productId: string) => void;
  decreaseCartItem: (productId: string) => void;
  removeCartItem: (productId: string) => void;
}
const ProductContext = createContext<ProductContextType | null>(null);

/**
 * 제품 상태와 관련된 컨텍스트 제공
 */
export function ProductProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(productReducer, initialState);

  // 제품 찾기
  const findProduct = useCallback(
    (productId: string) => {
      return state.productList.find((p) => p.id === productId);
    },
    [state.productList],
  );

  // 제품 수량 변경
  const updateProductQuantity = useCallback((productId: string, quantityChange: number) => {
    dispatch({
      type: ACTION_TYPES.UPDATE_QUANTITY,
      payload: { productId, quantityChange },
    });
  }, []);

  // 마지막 선택한 제품 설정
  const setLastSelectedItem = useCallback((productId: string) => {
    dispatch({
      type: ACTION_TYPES.SET_LAST_SELECTED,
      payload: { productId },
    });
  }, []);

  // 장바구니 제품 수량 증가
  const increaseCartItem = useCallback((productId: string) => {
    dispatch({
      type: ACTION_TYPES.INCREASE_CART_ITEM,
      payload: { productId },
    });
  }, []);

  // 장바구니 제품 수량 감소
  const decreaseCartItem = useCallback((productId: string) => {
    dispatch({
      type: ACTION_TYPES.DECREASE_CART_ITEM,
      payload: { productId },
    });
  }, []);

  const value: ProductContextType = {
    cartList: state.cartList,
    productList: state.productList,
    lastSelectedItem: state.lastSelectedItem,
    updateProductQuantity,
    findProduct,
    setLastSelectedItem,
    increaseCartItem,
    decreaseCartItem,
  };

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
}

export function useProduct(): ProductContextType {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProduct는 ProductProvider 내부에서 사용되어야 합니다.');
  }
  return context;
}
