import { productStore } from "../../../../store";
import { combineStyles } from "../../../../utils";

export const ProductSelect = () => {
  const $productSelect = document.createElement("select");
  const productSelectId = "product-select";
  const productSelectStyles = combineStyles("border", "rounded", "p-2", "mr-2");

  $productSelect.id = productSelectId;
  $productSelect.className = productSelectStyles;

  const updateSelectOptions = () => {
    const products = productStore.get("products");
    const currentValue = $productSelect.value;
    const discountInformation = productStore.get("discountInformation");

    // 초기화
    $productSelect.innerHTML = "";

    // 옵션 생성
    products.forEach((product) => {
      const $productOption = document.createElement("option");
      $productOption.value = product.id;

      const isFlashSaleProduct =
        discountInformation.isFlashSale &&
        discountInformation.flashSaleProductId === product.id;

      const isSuggestedProduct =
        discountInformation.isSuggestedProductId === product.id;

      const price = product.price;
      const displayPrice = isFlashSaleProduct
        ? price * 0.8
        : isSuggestedProduct
          ? price * 0.95
          : price;

      $productOption.textContent = `${product.name} - ${displayPrice}원`;
      $productOption.disabled = product.stock === 0;

      if (product.id === currentValue) $productOption.selected = true;

      $productSelect.appendChild($productOption);
    });
  };

  // 이벤트 처리
  $productSelect.addEventListener("change", (event) => {
    productStore.set("selectedProductId", event.target.value);
  });

  // 구독 처리
  productStore.subscribe("products", updateSelectOptions);
  productStore.subscribe("discountInformation", updateSelectOptions);

  return { element: $productSelect, initialize: updateSelectOptions };
};
