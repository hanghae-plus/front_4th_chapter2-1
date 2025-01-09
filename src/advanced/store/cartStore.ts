import { create } from 'zustand';
import { IPRODUCT } from '../types';

interface ICartStore {
	cart: IPRODUCT[];
	addCartItem: (item: IPRODUCT) => void;
	updateCartItem: (item: IPRODUCT) => void;
	removeCartItem: (item: IPRODUCT) => void;

	lastSelectedItemId: string | null;
	setLastSelectedItemId: (id: string) => void;
}

export const CartStore = create<ICartStore>((set) => ({
	cart: [],

	addCartItem: (item: IPRODUCT) => {
		set((prev) => ({
			cart: [...prev.cart, item],
		}));
	},
	updateCartItem: (item: IPRODUCT) => {
		set((prev) => ({
			cart: prev.cart.map((product) => (product.id === item.id ? item : product)),
		}));
	},
	removeCartItem: (item: IPRODUCT) => {
		set((prev) => ({
			cart: prev.cart.filter((product) => product.id !== item.id),
		}));
	},

	lastSelectedItemId: null,
	setLastSelectedItemId: (id: string) => {
		set(() => ({ lastSelectedItemId: id }));
	},
}));
