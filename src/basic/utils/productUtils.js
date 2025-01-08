export const isLowStock = (product) => product.quantity < 5;

export const makeLowStockMessage = (product) => {
  return `${product.name}: ${
    product.quantity > 0
      ? "재고 부족 (" + product.quantity + "개 남음)"
      : "품절"
  }\n`;
};
