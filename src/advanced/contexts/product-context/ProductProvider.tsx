import { useCallback, useState, createContext, useMemo } from 'react';

import { productList as initialProductList } from '../../constants/product';
import { useCreateCartContext } from '../utils/createContext';
import { useFlashSale } from './hooks/useFlashSale';
import { useRecommendProduct } from './hooks/useRecommendProduct';

import type { Product } from '../../types/product';
import type { PropsWithChildren } from 'react';

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

export const ProductProvider = ({ children }: PropsWithChildren) => {
  const [productList, setProductList] = useState<Product[]>(initialProductList);
  const [lastSaleItem, setLastSaleItem] = useState<Product | null>(null);

  useFlashSale(productList, setProductList);
  useRecommendProduct(productList, setProductList, lastSaleItem);

  const calculateQuantity = useCallback(
    (id: string, delta: number) => {
      const newProductList = productList.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + delta } : item,
      );

      setProductList(newProductList);
    },
    [productList],
  );

  const resetQuentity = useCallback(
    (id: string) => {
      const initialProductItem = initialProductList.find((product) => product.id === id);

      if (!initialProductItem) return;

      const initialQuantity = initialProductItem.quantity;

      const newProductList = productList.map((item) =>
        item.id === id ? { ...item, quantity: initialQuantity } : item,
      );

      setProductList(newProductList);
    },
    [productList],
  );

  const increaseQuantity = useCallback(
    (id: string) => {
      calculateQuantity(id, 1);
    },
    [calculateQuantity],
  );

  const decreaseQuantity = useCallback(
    (id: string) => {
      calculateQuantity(id, -1);
    },
    [calculateQuantity],
  );

  const addLastSaleItem = useCallback((item: Product) => {
    setLastSaleItem(item);
  }, []);

  const contextValue = useMemo(() => {
    return {
      increaseQuantity,
      decreaseQuantity,
      productList,
      resetQuentity,
      addLastSaleItem,
    };
  }, [increaseQuantity, decreaseQuantity, productList, resetQuentity, addLastSaleItem]);

  return <productContext.Provider value={contextValue}>{children}</productContext.Provider>;
};
