import type { Product } from '../types/product.type';

export const Cart = {
  items: [] as Product[],

  getItem(productId: string) {
    return this.items.find((item) => item.id === productId);
  },

  addItem(product: Product, quantity: number = 1) {
    const existingItem = this.items.find((item) => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.items.push({ ...product, quantity });
    }
  },

  decreaseItemQuantity(productId: string, quantity: number) {
    const existingItem = this.items.find((item) => item.id === productId);

    if (!existingItem) {
      return;
    }

    existingItem.quantity -= quantity;
    if (existingItem.quantity <= 0) {
      this.removeItem(productId);
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
