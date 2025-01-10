import { createContext, useContext } from 'react';
import { CartItem, Product } from '../type';

export interface GlobalContextType {
  values: {
    productList: Product[];
    cartItemList: CartItem[];
    randomDiscRateByProduct: Record<string, number>;
  };
  actions: {
    addCartItem: (itemId: string) => void;
    removeCartItem: (itemId: string) => void;
    editCartItem: (itemId: string, newQty: number) => void;
    setRandomDiscRate: (productId: string, rate: number) => void;
  };
}

export const GlobalContext = createContext<GlobalContextType | undefined>(
  undefined,
);

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);

  if (context === undefined) {
    throw new Error(
      'useGlobalContext must be used within an GlobalContextProvider',
    );
  }

  return context;
};
