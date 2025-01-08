import { createContext, Dispatch, PropsWithChildren, SetStateAction, useContext, useState } from 'react';
import { Product } from '../types/product';

export const initialProductList: Product[] = [
  { id: 'p1', name: '상품1', value: 10000, quantity: 50 },
  { id: 'p2', name: '상품2', value: 20000, quantity: 30 },
  { id: 'p3', name: '상품3', value: 30000, quantity: 20 },
  { id: 'p4', name: '상품4', value: 15000, quantity: 0 },
  { id: 'p5', name: '상품5', value: 25000, quantity: 10 },
];

interface ProductListContextType {
  productList: Product[];
  setProductList: Dispatch<SetStateAction<Product[]>>;
}

const ProductListContext = createContext<ProductListContextType | null>(null);

export const ProductListProvider = ({ children }: PropsWithChildren) => {
  const [productList, setProductList] = useState(initialProductList);

  return <ProductListContext.Provider value={{ productList, setProductList }}>{children}</ProductListContext.Provider>;
};

export const useProductList = () => {
  const context = useContext(ProductListContext);

  if (!context) {
    throw new Error('ProductListContext 는 ProductListProvider 내부에서 사용되어야 합니다.');
  }

  const { productList, setProductList } = context;

  const addProduct = (product: Product, quantity: number) => {
    setProductList((prevProductList) => {
      return prevProductList.map((prevProduct) => {
        if (prevProduct.id === product.id) {
          return {
            ...prevProduct,
            quantity: prevProduct.quantity + quantity,
          };
        }
        return prevProduct;
      });
    });
  };

  const removeProduct = (product: Product, quantity: number) => {
    setProductList((prevProductList) => {
      return prevProductList.map((prevProduct) => {
        if (prevProduct.id === product.id) {
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
    productList,
    addProduct,
    removeProduct,
    setProductList,
  };
};
