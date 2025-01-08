import { createStore } from '../utils/createStore';
import { productList } from './constants/productList';

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
    productList,
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
