import { useMemo, useState } from 'react';
import { usePreservedCallback } from '../hooks/usePreservedCallback';
import { createSafeContext } from '../lib/createSafeContext';
import { CartItem } from './CartProvider.types';
import { useProductsActionsContext } from './ProductsProvider';

interface Props {
  children?: React.ReactNode;
}

const CartProvider = ({ children }: Props) => {
  const { getProduct } = useProductsActionsContext('CartProvider');

  const [state, setState] = useState<ContextState>({
    items: new Map(),
  });

  // 장바구니에 담긴 상품의 정보를 가져오는 함수
  const getItem = usePreservedCallback((id: string) => {
    return state.items.get(id);
  });

  // 장바구니에 담긴 상품의 수량을 증가시키는 함수
  const addItem = usePreservedCallback((id: string) => {
    const product = getProduct(id);

    if (!product) {
      console.error(`아이디(${id})로 조회된 상품이 없어요. 아이디를 확인해 주세요.`);
      return;
    }

    const clone = new Map(state.items);
    const item = clone.get(id);

    const soldOut = product.stock <= (item?.quantity || 0);

    if (soldOut) {
      alert('재고가 부족합니다.');
      return;
    }

    if (item) {
      clone.set(id, { ...item, quantity: item.quantity + 1 });
      setState((prev) => ({ ...prev, items: clone }));
      return;
    }

    clone.set(id, { quantity: 1 });
    setState((prev) => ({ ...prev, items: clone }));
  });

  // 장바구니에 담긴 상품의 수량을 감소시키는 함수
  const subtractItem = usePreservedCallback((id: string) => {
    const clone = new Map(state.items);
    const item = clone.get(id);

    if (!item) {
      console.error(`아이디(${id})로 조회된 상품이 없어요. 아이디를 확인해 주세요.`);
      return;
    }

    clone.set(id, { ...item, quantity: item.quantity > 0 ? item.quantity - 1 : 0 });
    setState((prev) => ({ ...prev, items: clone }));
  });

  // 장바구니에 담긴 상품의 수량을 삭제시키는 함수
  const deleteItem = usePreservedCallback((id: string) => {
    const clone = new Map(state.items);
    const item = clone.get(id);

    if (!item) {
      console.error(`아이디(${id})로 조회된 상품이 없어요. 아이디를 확인해 주세요.`);
      return;
    }

    clone.delete(id);
    setState((prev) => ({ ...prev, items: clone }));
  });

  const actions = useMemo<ContextActions>(
    () => ({
      getItem,
      addItem,
      subtractItem,
      deleteItem,
    }),
    [getItem, addItem, subtractItem, deleteItem],
  );

  return (
    <CartStateProvider {...state}>
      <CartActionsProvider {...actions}>{children}</CartActionsProvider>
    </CartStateProvider>
  );
};

// Context API
interface ContextState {
  items: Map<string, CartItem>;
}

interface ContextActions {
  getItem: (id: string) => CartItem | undefined;
  addItem: (id: string) => void;
  subtractItem: (id: string) => void;
  deleteItem: (id: string) => void;
}

export const [CartStateProvider, useCartStateContext] =
  createSafeContext<ContextState>('CartProvider');
export const [CartActionsProvider, useCartActionsContext] =
  createSafeContext<ContextActions>('CartProvider');

export default CartProvider;
