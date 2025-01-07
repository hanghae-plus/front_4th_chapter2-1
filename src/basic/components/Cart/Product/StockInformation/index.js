import { combineStyles } from "../../../../utils";

export const StockInformation = () => {
  const $stockInformation = document.createElement("div");
  const stockInformationId = "stock-status";
  const stockInformationStyles = combineStyles("text-sm text-gray-500 mt-2");

  $stockInformation.id = stockInformationId;
  $stockInformation.className = stockInformationStyles;

  return $stockInformation;
};
