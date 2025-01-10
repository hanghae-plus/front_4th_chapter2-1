import { STOCKS, PRODUCT_LIST } from "advanced/constants";
import { useCartContext } from "advanced/hooks/useCartContext";

export const StockStatus = () => {
  const { cartState } = useCartContext();

  const renderOutOfStockMsg = PRODUCT_LIST.filter(
    (item) => item.remaining <= STOCKS.OUT_OF_STOCK
  )
    .map((item) => `${item.name}: 품절`)
    .join("\n");

  const renderLowStockMessage = cartState.items
    .map((item) => {
      if (item.remaining < STOCKS.LOW_STOCK_THRESHOLD) {
        const itemStockStatus =
          item.remaining > STOCKS.OUT_OF_STOCK
            ? `재고부족(${item.remaining}개 남음)`
            : "품절";

        return `${item.name}: ${itemStockStatus}`;
      }
    })
    .join("\n");

  const stockStatusMsg = `${renderOutOfStockMsg}\n${renderLowStockMessage}`;

  return (
    <div
      id="stock-status"
      className="mt-2 text-sm text-gray-500"
      style={{ whiteSpace: "pre-line" }}
    >
      {stockStatusMsg}
    </div>
  );
};
