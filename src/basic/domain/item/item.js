export default class Item {
  #id;
  #quantity;
  #value;
  // eslint-disable-next-line no-unused-private-class-members
  #name;

  constructor({ id, quantity, value, name }) {
    this.#id = id;
    this.#name = name;
    this.#quantity = quantity;
    this.#value = value;
  }

  get quantity() {
    return this.#quantity;
  }

  get id() {
    return this.#id;
  }

  get value() {
    return this.#value;
  }

  get name() {
    return this.#name;
  }

  decreaseQuantity(quantityChange = 1) {
    if (quantityChange < 0) quantityChange *= -1;

    this.#quantity -= quantityChange;
  }

  increaseQuantity(quantityChange = 1) {
    this.#quantity += quantityChange;
  }
}
