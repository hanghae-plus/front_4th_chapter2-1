import { useCallback, useState, useMemo } from 'react';

import { useFlashSale } from './hooks/useFlashSale';
import { useRecommendProduct } from './hooks/useRecommendProduct';
import { productContext } from './ProductContext';
import { productList as initialProductList } from '../../constants/product';

import type { Product } from '../../types/product';
import type { PropsWithChildren } from 'react';

export const ProductProvider = ({ children }: PropsWithChildren) => {
  const [productList, setProductList] = useState<Product[]>(initialProductList);
  const [lastSaleItem, setLastSaleItem] = useState<Product | null>(null);

  useFlashSale({ productList, setProductList });
  useRecommendProduct({ productList, setProductList, lastSaleItem });

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
