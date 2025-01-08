export const renderProductSelectOptionElement = ({ productList }) => {
  const $productSelect = document.getElementById('product-select');
  $productSelect.innerHTML = '';

  productList.forEach((item) => {
    const $option = document.createElement('option');
    $option.value = item.id;
    $option.textContent = item.name + ' - ' + item.price + '원';
    if (item.stock === 0) $option.disabled = true;
    $productSelect.appendChild($option);
  });
};
