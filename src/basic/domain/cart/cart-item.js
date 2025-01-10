import Item from "../item/item";

export default class CartItem extends Item {
  constructor({ id, quantity, value, name }) {
    super({ id, quantity, value, name });
  }

  get totalPrice() {
    return this.quantity * this.value;
  }

  get discount() {
    // ! 다형성을 챙기는 방법은 무엇일까?
    if (this.quantity >= 10) {
      if (this.id === "p1") return 0.1;
      else if (this.id === "p2") return 0.15;
      else if (this.id === "p3") return 0.2;
      else if (this.id === "p4") return 0.05;
      else if (this.id === "p5") return 0.25;
    }

    return 0;
  }
}
