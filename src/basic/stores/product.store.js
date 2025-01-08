class ProductStore {
  constructor() {
    this.points = 0;
    this.amount = 0;
    this.itemCount = 0;
    this.lastSelectedProduct = null;
  }

  static createInstance() {
    return new ProductStore();
  }

  getPoints() {
    return this.points;
  }

  setPoints(value) {
    this.points = value;
  }

  getAmount() {
    return this.amount;
  }

  setAmount(value) {
    this.amount = value;
  }

  getItemCount() {
    return this.itemCount;
  }

  setItemCount(value) {
    this.itemCount = value;
  }

  getLastSelectedProduct() {
    return this.lastSelectedProduct;
  }

  setLastSelectedProduct(value) {
    this.lastSelectedProduct = value;
  }
}

export default ProductStore;
