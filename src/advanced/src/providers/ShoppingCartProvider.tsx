import { createContext, Dispatch, PropsWithChildren, SetStateAction, useContext, useState } from 'react';
import { Product } from '../types/product';
import { useInStockProductList } from './InStockProductListProvider.tsx';

interface ShoppingCartContext {
  cartItems: Product[];
  setCartItems: Dispatch<SetStateAction<Product[]>>;
}

const ShoppingCartContext = createContext<ShoppingCartContext | null>(null);

const ShoppingCartProvider = ({ children }: PropsWithChildren) => {
  const [cartItems, setCartItems] = useState<Product[]>([]);

  return (
    <ShoppingCartContext.Provider
      value={{
        cartItems,
        setCartItems,
      }}
    >
      {children}
    </ShoppingCartContext.Provider>
  );
};

export default ShoppingCartProvider;

export const useShoppingCart = () => {
  const context = useContext(ShoppingCartContext);

  if (!context) {
    throw new Error('ShoppingCartContext 는 ShoppingCartProvider 내부에서 사용되어야 합니다.');
  }

  const { cartItems, setCartItems } = context;
  const { inStockProductList, addInStockProduct, removeInStockProduct } = useInStockProductList();

  const addOneInCart = (productId: string) => {
    const inStockProduct = inStockProductList.find((item) => item.id === productId);

    if (!inStockProduct) throw Error('잘못된 상품입니다. 해당 상품은 재고에 존재하지 않습니다.');

    const existInCart = cartItems.filter((item) => item.id === productId);

    if (inStockProduct.quantity < existInCart.length + 1) return alert('재고가 부족합니다.');

    setCartItems((prevCart) => [...prevCart, { ...inStockProduct }]);
    removeInStockProduct(productId, 1);
  };

  const removeOneInCart = (productId: string) => {
    setCartItems((prevCart) => {
      const index = prevCart.findIndex((item) => item.id === productId);

      if (index === -1) return prevCart;

      return [...prevCart.slice(0, index), ...prevCart.slice(index + 1)];
    });
    addInStockProduct(productId, 1);
  };

  const removeAllInCart = (productId: string) => {
    const inStockProduct = inStockProductList.find((item) => item.id === productId);

    if (!inStockProduct) throw Error('잘못된 상품입니다. 해당 상품은 재고에 존재하지 않습니다.');

    const filteredCartItems = cartItems.filter((item) => item.id !== productId);

    setCartItems(filteredCartItems);

    addInStockProduct(productId, inStockProduct.quantity - filteredCartItems.length);
  };

  return {
    cartItems,
    addOneInCart,
    removeOneInCart,
    removeAllInCart,
    setCartItems,
  };
};
