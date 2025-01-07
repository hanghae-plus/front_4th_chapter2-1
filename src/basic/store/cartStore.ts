import { createStore } from '../utils/createStore';

export interface Product {
  id: string;
  name: string;
  val: number;
  q: number;
}

interface CartState {
  cartList: Product[] | null;
  totalPrice: number;
}

interface CartActions {
  getCartList: () => Product[] | null;
  getCartItem: (id: string) => Product | undefined;
  addCartItem: (item: Product) => void;
  removeCartItem: (id: string) => void;
}

export const CartStore = createStore<CartState, CartActions>(
  {
    cartList: null,
    totalPrice: 0,
  },
  (state, notify) => ({
    getCartList: () => {
      return state.cartList;
    },
    getCartItem: (id: string) => {
      return state.cartList?.find((item) => item.id === id);
    },
    addCartItem: (item: Product) => {
      const newCartList = state.cartList ? state.cartList.concat(item) : [item];
      state.cartList = newCartList;
      state.totalPrice = (state.cartList || []).reduce((sum, item) => sum + item.val * item.q, 0);
      notify();
    },
    removeCartItem: (id: string) => {
      if (!state.cartList) return;
      state.cartList = state.cartList.filter((item) => item.id !== id);
      state.totalPrice = state.cartList.reduce((sum, item) => sum + item.val * item.q, 0);
      notify();
    },
  }),
);
