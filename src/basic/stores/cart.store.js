import { ProductModel } from '../models/product.model';

class CartStore {
  constructor() {
    /**
     * @type {Array<ProductModel>}
     */
    this.cartItems = [];
  }

  static createInstance() {
    return new CartStore();
  }

  /**
   * @param {ProductModel} product
   * @returns {void}
   */
  addCartItem(product) {
    const cartItem = this.getCartItem(product.id);
    if (cartItem) {
      cartItem.increaseQuantity(1);
    } else {
      const copiedProduct = JSON.parse(JSON.stringify(product));
      const newProduct = new ProductModel(copiedProduct.id, copiedProduct.name, copiedProduct.price, 1);
      this.cartItems.push(newProduct);
    }
  }

  getAmount() {
    return this.cartItems.reduce((acc, item) => {
      return acc + item.price * item.quantity;
    }, 0);
  }

  /**
   * @param {number} productId
   * @returns {ProductModel | undefined}
   */
  getCartItem(productId) {
    return this.cartItems.find((item) => item.id === productId);
  }

  getCartItems() {
    return this.cartItems;
  }

  destroyInstance() {
    this.cartItems = [];
  }
}

export default CartStore;
