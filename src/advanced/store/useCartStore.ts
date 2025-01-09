import { create } from 'zustand';

export interface CartItemType {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartItemsStore {
  cartItems: CartItemType[];
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  removeItem: (id: string) => void;
}

export const useCartItemsStore = create<CartItemsStore>((set) => ({
  cartItems: [],
  increaseQuantity: (id: string) => {
    set((state) => ({
      cartItems: state.cartItems.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      ),
    }));
  },
  decreaseQuantity: (id: string) => {
    set((state) => ({
      cartItems: state.cartItems.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity - 1 } : item
      ),
    }));
  },
  removeItem: (id: string) => {
    set((state) => ({
      cartItems: state.cartItems.filter((item) => item.id !== id),
    }));
  },
}));
