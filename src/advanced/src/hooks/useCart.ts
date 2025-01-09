import { useState, useCallback } from 'react';
import { CartState, Product } from '../types';
// import { discountService } from '../services/discount';
import { pointService } from '../services/points';

export const useCart = () => {
  const [cart, setCart] = useState<CartState>({
    items: [],
    lastSelectedProductId: null,
    bonusPoints: 0,
    totalAmount: 0,
  });

  const addToCart = useCallback((product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.items.find((item) => item.id === product.id);
      const updatedItems = existingItem
        ? prevCart.items.map((item) =>
            item.id === product.id ? { ...item, cartQuantity: item.quantity + 1 } : item,
          )
        : [...prevCart.items, { ...product, cartQuantity: 1 }];

      const totalAmount = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

      const bonusPoints = pointService.calculatePoints(totalAmount);

      return {
        ...prevCart,
        items: updatedItems,
        lastSelectedProductId: product.id,
        totalAmount,
        bonusPoints,
      };
    });
  }, []);

  const updateQuantity = useCallback((id: string, change: number) => {
    setCart((prevCart) => {
      const updatedItems = prevCart.items
        .map((item) => (item.id === id ? { ...item, cartQuantity: item.quantity + change } : item))
        .filter((item) => item.quantity > 0);

      const totalAmount = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

      const bonusPoints = pointService.calculatePoints(totalAmount);

      return { ...prevCart, items: updatedItems, totalAmount, bonusPoints };
    });
  }, []);

  return { cart, addToCart, updateQuantity };
};
