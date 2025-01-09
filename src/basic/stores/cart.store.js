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
    const cartItem = this.getCartItemByProductId(product.id);
    if (cartItem) {
      cartItem.increaseQuantity(1);
    } else {
      const copiedProduct = JSON.parse(JSON.stringify(product));
      const newProduct = new ProductModel(copiedProduct.id, copiedProduct.name, copiedProduct.price, 1);
      this.cartItems.push(newProduct);
    }
  }

  removeCartItem(productId) {
    const cartItem = this.getCartItemByProductId(productId);

    if (!cartItem) {
      throw new Error('해당 상품이 존재하지 않습니다.');
    }

    cartItem.decreaseQuantity(1);
  }

  deleteCartItem(productId) {
    this.cartItems = this.cartItems.filter((item) => item.id !== productId);
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
  getCartItemByProductId(productId) {
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
