import { useCallback, useState, createContext, useMemo } from 'react';

import { productList as initialProductList } from '../../constants/product';
import { useCreateCartContext } from '../utils/createContext';

import type { Product } from '../../types/product';
import type { PropsWithChildren } from 'react';

interface ProductContextType {
  productList: Product[];
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
}

export const productContext = createContext<ProductContextType | undefined>(undefined);

export const useGetProductList = () =>
  useCreateCartContext(productContext, 'useGetProductList', 'productProvider').productList;

export const useIncreaseQuantity = () =>
  useCreateCartContext(productContext, 'useIncreaseQuantity', 'productProvider').increaseQuantity;

export const useDecreaseQuantity = () =>
  useCreateCartContext(productContext, 'useDecreaseQuantity', 'productProvider').decreaseQuantity;

export const ProductProvider = ({ children }: PropsWithChildren) => {
  const [productList, setProductList] = useState<Product[]>(initialProductList);

  const calculateQuantity = useCallback(
    (id: string, delta: number) => {
      const newProductList = productList.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + delta } : item,
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

  const contextValue = useMemo(() => {
    return {
      increaseQuantity,
      decreaseQuantity,
      productList,
    };
  }, [decreaseQuantity, increaseQuantity, productList]);

  return <productContext.Provider value={contextValue}>{children}</productContext.Provider>;
};
