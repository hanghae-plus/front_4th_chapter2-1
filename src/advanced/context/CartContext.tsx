import {
  createContext,
  ReactNode,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { Cart } from '../interface/cart';

export interface CartContextType {
  cart: Cart;
  setCart: React.Dispatch<React.SetStateAction<Cart>>;
  isDisplayBonusPoint: boolean;
  setIsDisplayBonusPoint: React.Dispatch<React.SetStateAction<boolean>>;
}

interface CartContextProviderProps {
  children: ReactNode;
}

export const CartContext = createContext<CartContextType | undefined>(
  undefined
);

export const CartContextProvider = ({ children }: CartContextProviderProps) => {
  const [cart, setCartState] = useState<Cart>({
    bonusPoints: 0,
    totalAmt: 0,
    itemCnt: 0,
    cartDisplay: [],
  });

  const [isDisplayBonusPoint, setIsDisplayBonusPoint] = useState(false);

  const setCart = useCallback<React.Dispatch<React.SetStateAction<Cart>>>(
    (newCartOrUpdater) => {
      setCartState((prevCart) => {
        if (typeof newCartOrUpdater === 'function') {
          return newCartOrUpdater(prevCart);
        }
        return newCartOrUpdater;
      });
    },
    []
  );

  const contextValue = useMemo<CartContextType>(
    () => ({
      cart,
      setCart,
      isDisplayBonusPoint,
      setIsDisplayBonusPoint,
    }),
    [cart, setCart]
  );

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
};
