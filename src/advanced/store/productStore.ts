import { create } from 'zustand';
import { PRODUCTS } from '../constants';
import { IPRODUCT } from '../types';

interface IProductStore {
	products: IPRODUCT[];
	updateProducts: (item: IPRODUCT) => void;
}

export const ProductStore = create<IProductStore>((set) => ({
	products: PRODUCTS,
	updateProducts: (item: IPRODUCT) => {
		set((prev) => ({
			products: prev.products.map((product) => (product.id === item.id ? item : product)),
		}));
	},
}));
