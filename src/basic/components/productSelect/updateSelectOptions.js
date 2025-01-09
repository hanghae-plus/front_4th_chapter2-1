import ProductSelectOption from './ProductSelectOption';

/**
 * 제품 선택 요소의 옵션 렌더링
 * @description 'product-select' 요소에 제품 목록을 option 요소로 추가
 * @param {*} products
 * @returns {void}
 */
export function updateSelectOptions(products) {
  const productSelector = document.getElementById('product-select');
  productSelector.innerHTML = '';

  products.forEach(product => {
    const selectOption = ProductSelectOption(product);
    productSelector.appendChild(selectOption);
  });
}
