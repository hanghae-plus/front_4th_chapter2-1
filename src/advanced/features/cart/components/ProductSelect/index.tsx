import React, { useEffect } from "react";
import { useProduct } from "../../../../contexts/ProductContext";
import { combineStyles } from "../../../../utils";

const ProductSelect = () => {
  const { productState, setProductState } = useProduct();
  const productSelectStyles = combineStyles("border", "rounded", "p-2", "mr-2");

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setProductState((prev) => ({
      ...prev,
      selectedProductId: event.target.value,
    }));
  };

  const getDisplayPrice = (
    price: number,
    productId: string,
    discountInfo: typeof productState.discountInformation
  ) => {
    const isFlashSale =
      discountInfo.isFlashSale && discountInfo.flashSaleProductId === productId;
    const isSuggestedProduct = discountInfo.suggestedProductId === productId;

    if (isFlashSale) {
      return price * 0.8; // 20% 할인
    }
    if (isSuggestedProduct) {
      return price * 0.95; // 5% 할인
    }
    return price;
  };

  return (
    <select
      id="product-select"
      className={productSelectStyles}
      value={productState.selectedProductId || ""}
      onChange={handleSelectChange}
    >
      <option value="">상품을 선택하세요</option>
      {productState.products.map((product) => {
        const displayPrice = getDisplayPrice(
          product.price,
          product.id,
          productState.discountInformation
        );

        return (
          <option
            key={product.id}
            value={product.id}
            disabled={product.stock === 0}
          >
            {`${product.name} - ${displayPrice}원`}
          </option>
        );
      })}
    </select>
  );
};

export default ProductSelect;
