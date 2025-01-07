import { STOCKS } from "advanced/constants";
import { Product } from "advanced/models/Product";
import { productList } from "advanced/store/productList";

function StockStatus() {
  const handleStockMessage = ({ name, remaining }: Product) => {
    const isOutOfStock = remaining <= STOCKS.OUT_OF_STOCK;
    const isLowStock = remaining < STOCKS.LOW_STOCK_THRESHOLD;

    if (isOutOfStock) {
      return `${name}: 품절`;
    } else if (isLowStock) {
      return `${name}: 재고 부족 (${remaining}개 남음)`;
    } else {
      return "";
    }
  };

  // 재고 메시지
  return productList
    .map(handleStockMessage)
    .filter((msg) => msg !== "")
    .join("\n");
}

export default StockStatus;
