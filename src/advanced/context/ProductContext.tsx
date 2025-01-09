import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from 'react';
import { DISCOUNT_RATES, LIGHTNING_SALE, SUGGESTION } from '../constants';
import { initialProductList } from '../data/initialProductList';
import { ProductListType, ProductType } from '../types/ProductType';
import { helper } from '../utils/helper';
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
  updateProductPrice: (productId: string, price: number) => void;
  runLightningSale: () => void;
  runSuggestion: () => void;
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

  // 장바구니 제품 삭제
  const removeCartItem = useCallback((productId: string) => {
    dispatch({
      type: ACTION_TYPES.REMOVE_CART_ITEM,
      payload: { productId },
    });
  }, []);

  // 제품 가격 업데이트
  const updateProductPrice = useCallback((productId: string, price: number) => {
    dispatch({
      type: ACTION_TYPES.UPDATE_PRICE,
      payload: { productId, price },
    });
  }, []);

  // 반짝 세일 실행
  const runLightningSale = useCallback(() => {
    const luckyItem = state.productList[Math.floor(Math.random() * state.productList.length)];
    const isLucky = Math.random() < DISCOUNT_RATES.RANDOM && luckyItem.quantity > 0;
    if (isLucky) {
      alert(helper.getLightningSaleMessage(luckyItem.name));

      const newPrice = Math.round(luckyItem.price * LIGHTNING_SALE.RATE);

      dispatch({
        type: ACTION_TYPES.RUN_LIGHTNING_SALE,
        payload: { productId: luckyItem.id, price: newPrice },
      });
    }
  }, [state.productList]);

  // 추천 프로모션 실행
  const runSuggestion = useCallback(() => {
    if (!state.lastSelectedItem) return;

    const suggest = state.productList.find(
      (item) => item.id !== state.lastSelectedItem && item.quantity > 0,
    );

    if (suggest) {
      const newPrice = Math.round(suggest.price * SUGGESTION.RATE);
      alert(helper.getSuggestionMessage(suggest.name));
      dispatch({
        type: ACTION_TYPES.RUN_SUGGESTION,
        payload: { productId: suggest.id, price: newPrice },
      });
    }
  }, [state.lastSelectedItem, state.productList]);

  // 번개 세일, 추천 프로모션 실행
  useEffect(() => {
    const lightningDelay = Math.random() * LIGHTNING_SALE.DELAY;
    const suggestionDelay = Math.random() * SUGGESTION.DELAY;

    const lightningTimer = setTimeout(() => {
      runLightningSale();
      const lightningInterval = setInterval(runLightningSale, LIGHTNING_SALE.INTERVAL);
      return () => clearInterval(lightningInterval);
    }, lightningDelay);

    const suggestionTimer = setTimeout(() => {
      runSuggestion();
      const suggestionInterval = setInterval(runSuggestion, SUGGESTION.INTERVAL);
      return () => clearInterval(suggestionInterval);
    }, suggestionDelay);

    return () => {
      clearTimeout(lightningTimer);
      clearTimeout(suggestionTimer);
    };
  }, [runLightningSale, runSuggestion]);

  const value: ProductContextType = {
    cartList: state.cartList,
    productList: state.productList,
    lastSelectedItem: state.lastSelectedItem,
    updateProductQuantity,
    findProduct,
    setLastSelectedItem,
    increaseCartItem,
    decreaseCartItem,
    removeCartItem,
    updateProductPrice,
    runLightningSale,
    runSuggestion,
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
