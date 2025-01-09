import { create } from 'zustand';

export interface CartItemType {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartItemsStore {
  cartItems: CartItemType[];
}

export const useCartItemsStore = create<CartItemsStore>(() => ({
  cartItems: [],
}));
