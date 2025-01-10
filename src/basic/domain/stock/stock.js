export default class Stock {
  #items;
  constructor(items) {
    this.#items = items;
  }

  get items() {
    return [...this.#items];
  }

  findById(id) {
    return this.#items.find((i) => i.id === id);
  }

  generateStockInfoMessage() {
    return this.#items
      .filter((item) => item.quantity < 5)
      .map((item) => (item.quantity > 0 ? `${item.name}: 재고 부족 (${item.quantity}개 남음)` : `${item.name}: 품절`))
      .join("\n");
  }
}
