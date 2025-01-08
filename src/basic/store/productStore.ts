import { createStore } from '../utils/createStore';

export interface Product {
  id: string;
  name: string;
  val: number;
  q: number;
}

interface State {
  productList: Product[];
}

interface Actions {
  getProductList: () => Product[];
  getProductItem: (id: string) => Product | undefined;
  decreaseQ: (id: string) => void;
  increaseQ: (id: string) => void;
}

export const ProductStore = createStore<State, Actions>(
  {
    productList: [
      { id: 'p1', name: '상품1', val: 10000, q: 50 },
      { id: 'p2', name: '상품2', val: 20000, q: 30 },
      { id: 'p3', name: '상품3', val: 30000, q: 20 },
      { id: 'p4', name: '상품4', val: 15000, q: 0 },
      { id: 'p5', name: '상품5', val: 25000, q: 10 },
    ],
  },
  (state, notify) => ({
    getProductList: () => {
      return state.productList;
    },
    getProductItem: (id: string) => {
      return state.productList.find((item) => item.id === id);
    },
    decreaseQ: (id: string) => {
      const newProductList = state.productList?.map((item) => (item.id === id ? { ...item, q: item.q - 1 } : item));
      state.productList = newProductList || state.productList;
      notify();
    },
    increaseQ: (id: string) => {
      const newProductList = state.productList?.map((item) => (item.id === id ? { ...item, q: item.q + 1 } : item));
      state.productList = newProductList || state.productList;
      notify();
    },
  }),
);
