import { createContext, Dispatch, PropsWithChildren, SetStateAction, useContext, useState } from 'react';
import { Product } from '../types/product';

export const initialProductList: Product[] = [
  { id: 'p1', name: '상품1', value: 10000, quantity: 50 },
  { id: 'p2', name: '상품2', value: 20000, quantity: 30 },
  { id: 'p3', name: '상품3', value: 30000, quantity: 20 },
  { id: 'p4', name: '상품4', value: 15000, quantity: 0 },
  { id: 'p5', name: '상품5', value: 25000, quantity: 10 },
];

interface InStockProductListContextType {
  inStockProductList: Product[];
  setInStockProductList: Dispatch<SetStateAction<Product[]>>;
}

const InStockProductListContext = createContext<InStockProductListContextType | null>(null);

export const InStockProductListProvider = ({ children }: PropsWithChildren) => {
  const [inStockProductList, setInStockProductList] = useState(initialProductList);

  return (
    <InStockProductListContext.Provider value={{ inStockProductList, setInStockProductList }}>
      {children}
    </InStockProductListContext.Provider>
  );
};

export const useInStockProductList = () => {
  const context = useContext(InStockProductListContext);

  if (!context) {
    throw new Error('InStockProductListContext 는 InStockProductListProvider 내부에서 사용되어야 합니다.');
  }

  const { inStockProductList, setInStockProductList } = context;

  const addInStockProduct = (productId: string, quantity: number) => {
    setInStockProductList((prevProductList) => {
      return prevProductList.map((prevProduct) => {
        if (prevProduct.id === productId) {
          return {
            ...prevProduct,
            quantity: prevProduct.quantity + quantity,
          };
        }
        return prevProduct;
      });
    });
  };

  const removeInStockProduct = (productId: string, quantity: number) => {
    setInStockProductList((prevProductList) => {
      return prevProductList.map((prevProduct) => {
        if (prevProduct.id === productId) {
          return {
            ...prevProduct,
            quantity: prevProduct.quantity - quantity,
          };
        }
        return prevProduct;
      });
    });
  };

  return {
    inStockProductList,
    addInStockProduct,
    removeInStockProduct,
    setInStockProductList,
  };
};
