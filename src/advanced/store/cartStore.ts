import { create } from 'zustand';
import { IPRODUCT } from '../types';

interface ICartStore {
	cart: IPRODUCT[];
	addCart: (item: IPRODUCT) => void;
	updateCart: (item: IPRODUCT) => void;
	removeCartItem: (item: IPRODUCT) => void;
	lastSelectedItemId: string | null;
	setLastSelectedItemId: (id: string) => void;
}
export const CartStore = create<ICartStore>((set) => ({
	cart: [],
	addCart: (item: IPRODUCT) => {
		set((prev) => ({
			cart: [...prev.cart, item],
		}));
	},
	updateCart: (item: IPRODUCT) => {
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
