import { productStore } from "../../../../store";
import { combineStyles } from "../../../../utils";

export const StockInformation = () => {
  // Stock Information Element
  const $stockInformation = document.createElement("div");
  const stockInformationId = "stock-status";
  const stockInformationStyles = combineStyles(
    "text-sm",
    "text-gray-500",
    "mt-2",
  );
  $stockInformation.id = stockInformationId;
  $stockInformation.className = stockInformationStyles;

  const updateStockInformationDisplay = (products) => {
    const lowStockInformationMessages = products
      .filter((product) => product.stock < 5)
      .map((product) => {
        const stockStatus =
          product.stock > 0 ? `재고 부족 (${product.stock}개 남음)` : "품절";
        return `${product.name}: ${stockStatus}`;
      })
      .join("\n");

    $stockInformation.textContent = lowStockInformationMessages;
  };

  // 초기 렌더링
  const initialProducts = productStore.get("products");
  if (initialProducts) {
    updateStockInformationDisplay(initialProducts);
  }

  // 상품 상태 변경 구독
  productStore.subscribe("products", () => {
    const currentProducts = productStore.get("products");
    if (currentProducts) {
      updateStockInformationDisplay(currentProducts);
    }
  });

  return $stockInformation;
};
