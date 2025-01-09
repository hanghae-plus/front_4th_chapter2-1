import { createContext, useContext, useState, ReactNode } from 'react';
import { Item } from '../types';

interface CartContextProps {
  lastSel: string | null;
  totalAmount: number;
  discountRate: number;
  itemCount: number;
  productList: Item[];
  cartList: Item[];
  setLastSel: (id: string | null) => void;
  updateTotalAmount: (amount: number) => void;
  updateDiscountRate: (rate: number) => void;
  updateItemCount: (count: number) => void;
  updateProductList: (productList: Item[]) => void;
  updateCartList: (cartList: Item[]) => void;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [lastSel, setLastSel] = useState<string | null>(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [discountRate, setDiscountRate] = useState(0);
  const [itemCount, setItemCount] = useState(0);
  const [productList, setProductList] = useState<Item[]>([
    { id: 'p1', name: '상품1', price: 10000, volume: 50 },
    { id: 'p2', name: '상품2', price: 20000, volume: 30 },
    { id: 'p3', name: '상품3', price: 30000, volume: 20 },
    { id: 'p4', name: '상품4', price: 15000, volume: 0 },
    { id: 'p5', name: '상품5', price: 25000, volume: 10 }
  ]);
  const [cartList, setCartList] = useState<Item[]>([]);

  const value = {
    lastSel,
    totalAmount,
    discountRate,
    itemCount,
    productList,
    cartList,
    setLastSel,
    updateTotalAmount: setTotalAmount,
    updateDiscountRate: setDiscountRate,
    updateItemCount: setItemCount,
    updateProductList: setProductList,
    updateCartList: setCartList
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCartContext must be used within CartProvider');
  }
  return context;
};
