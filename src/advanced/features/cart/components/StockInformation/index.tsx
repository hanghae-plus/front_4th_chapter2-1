import React from "react";
import { useProduct } from "../../../../contexts/ProductContext";
import { combineStyles } from "../../../../utils";

const StockInformation = () => {
  const { productState } = useProduct();

  const stockInformationStyles = combineStyles(
    "text-sm",
    "text-gray-500",
    "mt-2"
  );

  const getLowStockProducts = () => {
    return productState.products
      .filter((product) => product.stock < 5)
      .map((product) => {
        const stockStatus =
          product.stock > 0 ? `재고 부족 (${product.stock}개 남음)` : "품절";
        return `${product.name}: ${stockStatus}`;
      })
      .join("\n");
  };

  return (
    <div id="stock-status" className={stockInformationStyles}>
      {getLowStockProducts()}
    </div>
  );
};

export default StockInformation;
