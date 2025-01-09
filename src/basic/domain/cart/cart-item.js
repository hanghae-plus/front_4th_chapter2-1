export default class CartItem {
  #id;
  #quantity;
  #value;
  #name;

  constructor({ id, quantity, value, name }) {
    this.#id = id;
    this.#name = name;
    this.#quantity = quantity;
    this.#value = value;
  }

  get totalPrice() {
    return this.#quantity * this.#value;
  }

  get discount() {
    // ! 다형성을 챙기는 방법은 무엇일까?
    if (this.#quantity >= 10) {
      if (this.#id === "p1") return 0.1;
      else if (this.#id === "p2") return 0.15;
      else if (this.#id === "p3") return 0.2;
      else if (this.#id === "p4") return 0.05;
      else if (this.#id === "p5") return 0.25;
    }

    return 0;
  }

  get quantity() {
    return this.#quantity;
  }

  get id() {
    return this.#id;
  }

  decreaseQuantity(quantityChange = 1) {
    this.#quantity -= quantityChange;
  }

  increaseQuantity(quantityChange = 1) {
    this.#quantity += quantityChange;
  }
}
