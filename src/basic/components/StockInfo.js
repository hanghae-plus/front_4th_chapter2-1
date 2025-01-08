export function renderStockInfo(stockEl, products) {
  const lowStockProducts = products.filter((item) => item.q < 5);
  stockEl.textContent = lowStockProducts
    .map(
      (item) =>
        `${item.name}: ${item.q > 0 ? `재고 부족 (${item.q}개 남음)` : "품절"}`,
    )
    .join("\n");
}
