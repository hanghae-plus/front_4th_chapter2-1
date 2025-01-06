import type { Product } from '../types/product.type';

export const Cart = {
  items: [] as Product[],

  addItem(product: Product, quantity: number = 1) {
    const existingItem = this.items.find((item) => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.items.push({ ...product, quantity });
    }
  },

  removeItem(productId: string) {
    this.items = this.items.filter((item) => item.id !== productId);
  },

  getTotalQuantity() {
    return this.items.reduce((total, item) => total + item.quantity, 0);
  },

  clear() {
    this.items = [];
  },
};
