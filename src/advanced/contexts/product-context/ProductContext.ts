import { createContext } from 'react';

import { useCreateCartContext } from '../utils/createContext';

import type { Product } from '../../types/product';

interface ProductContextType {
  productList: Product[];
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  resetQuentity: (id: string) => void;
  addLastSaleItem: (item: Product) => void;
}

export const productContext = createContext<ProductContextType | undefined>(undefined);

export const useGetProductList = () =>
  useCreateCartContext(productContext, 'useGetProductList', 'productProvider').productList;

export const useIncreaseQuantity = () =>
  useCreateCartContext(productContext, 'useIncreaseQuantity', 'productProvider').increaseQuantity;

export const useDecreaseQuantity = () =>
  useCreateCartContext(productContext, 'useDecreaseQuantity', 'productProvider').decreaseQuantity;

export const useResetQuantity = () =>
  useCreateCartContext(productContext, 'useResetQuantity', 'productProvider').resetQuentity;

export const useAddLastSaleItem = () =>
  useCreateCartContext(productContext, 'useAddLastSaleItem', 'cartProvider').addLastSaleItem;
