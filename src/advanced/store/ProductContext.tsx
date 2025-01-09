import { createContext, PropsWithChildren, useCallback, useContext, useReducer } from 'react';
import { initialProductList } from '../data/initialProductList';
import { ProductListType, ProductType } from '../types/ProductType';
import { ACTION_TYPES, productReducer } from './productReducer';

const initialState = {
  productList: initialProductList,
  lastSelectedItem: null,
} as const;

interface ProductContextType {
  productList: ProductListType;
  lastSelectedItem: string | null;
  updateProductQuantity: (productId: string, quantityChange: number) => void;
  findProduct: (productId: string) => ProductType | undefined;
  setLastSelectedItem: (productId: string) => void;
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

  const value: ProductContextType = {
    productList: state.productList,
    lastSelectedItem: state.lastSelectedItem,
    updateProductQuantity,
    findProduct,
    setLastSelectedItem,
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
