import CartStore from './src/basic/stores/cart.store';
import ProductStore from './src/basic/stores/product.store';

declare global {
  interface Window {
    cartStore: CartStore;
    productStore: ProductStore;
  }

  var cartStore: CartStore;
  var productStore: ProductStore;
}

export {};
