import { createContext } from 'react';

import { useCreateCartContext } from '../utils/createContext';

import type { Product } from '../../types/product';

interface CartContextType {
  cartList: Product[];
  totalPrice: number;
  totalDiscountRate: number;
  point: number;
  addCartItem: (item: Product) => void;
  clearCartItem: (id: string) => void;
  removeCartItem: (id: string) => void;
}

export const cartContext = createContext<CartContextType | undefined>(undefined);

export const useGetCartList = () => useCreateCartContext(cartContext, 'useGetCartList', 'cartProvider').cartList;

export const useGetTotalPrice = () => useCreateCartContext(cartContext, 'useGetTotalPrice', 'cartProvider').totalPrice;

export const useGetPoint = () => useCreateCartContext(cartContext, 'useGetPoint', 'cartProvider').point;

export const useGetTotalDiscountRate = () =>
  useCreateCartContext(cartContext, 'useGetTotalDiscountRate', 'cartProvider').totalDiscountRate;

export const useAddCartItem = () => useCreateCartContext(cartContext, 'useAddCartItem', 'cartProvider').addCartItem;

export const useRemoveCartItem = () =>
  useCreateCartContext(cartContext, 'useRemoveCartItem', 'cartProvider').removeCartItem;

export const useClearCartItem = () =>
  useCreateCartContext(cartContext, 'useClearCartItem', 'cartProvider').clearCartItem;
