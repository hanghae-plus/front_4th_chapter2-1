import { createStore } from '../utils/createStore';
import { productList } from './constants/productList';

import type { Product } from '../types/product';

interface State {
  productList: Product[];
  lastSaleItem: Product | null;
}

interface Actions {
  getProductList: () => Product[];
  decreaseQuantity: (id: string) => void;
  increaseQuantity: (id: string) => void;
  resetQuantity: (id: string) => void;
  addLastSaleItem: (item: Product) => void;
}

export const ProductStore = createStore<State, Actions>(
  {
    productList,
    lastSaleItem: null,
  },
  (state, notify) => {
    const calculateQuantity = (id: string, delta: number) => {
      const newProductList = productList.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + delta } : item,
      );

      state.productList = newProductList;
    };

    return {
      getProductList: () => {
        return state.productList;
      },
      decreaseQuantity: (id: string) => {
        calculateQuantity(id, -1);
        notify();
      },
      increaseQuantity: (id: string) => {
        calculateQuantity(id, 1);
        notify();
      },
      resetQuantity: (id: string) => {
        const initialProductItem = productList.find((product) => product.id === id);

        if (!initialProductItem) return;

        const initialQuantity = initialProductItem.quantity;

        const newProductList = productList.map((item) =>
          item.id === id ? { ...item, quantity: initialQuantity } : item,
        );

        state.productList = newProductList;

        notify();
      },
      addLastSaleItem: (item: Product) => {
        state.lastSaleItem = item;

        notify();
      },
    };
  },
);
