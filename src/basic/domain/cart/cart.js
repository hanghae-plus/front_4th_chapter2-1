const BONUS_POINTS_THRESHOLD = 1000;

export default class Cart {
  #items = [];
  #totalAmount = 0;

  get itemCount() {
    return this.#items.reduce((acc, cur) => acc + cur.quantity, 0);
  }

  get originalTotalPrice() {
    return this.#items.reduce((acc, cur) => acc + cur.totalPrice, 0);
  }

  get totalAmount() {
    this.#totalAmount = this.#calculateTotalAmount();
    return this.#totalAmount;
  }

  set totalAmount(value) {
    this.#totalAmount = value;
  }

  get bonusPoints() {
    return Math.floor(this.totalAmount / BONUS_POINTS_THRESHOLD);
  }

  get discountRate() {
    let result = 0;

    const bulkDiscount = this.#calculateBulkDiscount();
    result = Math.max(result, bulkDiscount);

    const dateDiscount = this.#calculateDateDiscount();
    result = Math.max(result, dateDiscount);

    return result;
  }

  push(item) {
    this.#items.push(item);
  }

  removeItem(item) {
    const index = this.#items.findIndex((i) => i.id === item.id);
    const result = this.#items.splice(index, 1);

    return result;
  }

  findById(id) {
    return this.#items.find((i) => i.id === id);
  }

  #calculateBulkDiscount() {
    if (this.itemCount < 30) {
      return this.#calculateItemDiscountRate();
    }

    const bulkDiscountAmount = this.originalTotalPrice * 0.25;
    const itemDiscountAmount = this.originalTotalPrice - this.totalAmount;

    if (bulkDiscountAmount > itemDiscountAmount) {
      this.totalAmount = this.originalTotalPrice * (1 - 0.25);
      return 0.25;
    }

    return this.#calculateItemDiscountRate();
  }

  #calculateItemDiscountRate() {
    return (this.originalTotalPrice - this.totalAmount) / this.originalTotalPrice;
  }

  #calculateDateDiscount() {
    const isTuesday = new Date().getDay() === 2;
    if (isTuesday) {
      this.totalAmount *= 1 - 0.1;
      return 0.1;
    }
    return 0;
  }

  #calculateTotalAmount() {
    return this.#items.reduce((acc, cur) => acc + cur.totalPrice * (1 - cur.discount), 0);
  }
}
