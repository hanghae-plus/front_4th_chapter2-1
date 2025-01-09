import { create } from 'zustand';
import { PRODUCTS } from '../constants';
import { IPRODUCT } from '../types/products';

interface IProductStore {
	products: IPRODUCT[];
	setProducts: (item: IPRODUCT) => void;
}

export const ProductStore = create<IProductStore>((set) => ({
	products: PRODUCTS,
	setProducts: (item: IPRODUCT) => {
		set((prev) => ({
			products: prev.products.map((product) => (product.id === item.id ? item : product)),
		}));
	},
}));
