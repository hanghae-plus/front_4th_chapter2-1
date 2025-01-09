class ProductStore {
  constructor() {
    this.point = 0;
    this.amount = 0;
    this.itemCount = 0;
    this.lastSelectedProduct = null;
  }

  static createInstance() {
    return new ProductStore();
  }

  getPoint() {
    return this.point;
  }

  setPoint(value) {
    this.point = value;
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

  destroyInstance() {
    this.point = 0;
    this.amount = 0;
    this.itemCount = 0;
    this.lastSelectedProduct = null;
  }
}

export default ProductStore;
