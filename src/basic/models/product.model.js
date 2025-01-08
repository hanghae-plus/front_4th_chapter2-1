export class ProductModel {
  constructor(id, name, price, quantity) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.quantity = quantity;
  }

  static createInstance(id, name, price, quantity) {
    return new ProductModel(id, name, price, quantity);
  }

  get isSoldOut() {
    return this.quantity === 0;
  }

  getQuantity() {
    return this.quantity;
  }

  setQuantity(quantity) {
    this.quantity = quantity;
  }

  increaseQuantity(value) {
    this.setQuantity(this.quantity + value);
  }

  decreaseQuantity(value) {
    this.setQuantity(this.quantity - value);
  }
}
