import { helper } from "../../utils/helper";

/**
 * 제품 선택 요소의 옵션 렌더링
 * @description 'product-select' 요소에 제품 목록을 option 요소로 추가
 * @param {*} products
 * @returns {void}
 */
export function updateSelectOptions(products) {
  const productSelector = document.getElementById('product-select');
  productSelector.innerHTML = '';
  products.forEach(function (product) {
    const selectOption = document.createElement('option');

    selectOption.value = product.id;
    selectOption.textContent = helper.getNameAndPriceMessage(
      product.name,
      product.price,
    );
    if (product.quantity === 0) selectOption.disabled = true;

    productSelector.appendChild(selectOption);
  });
}