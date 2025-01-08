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

export const createProductSelectElement = () => {
  const $productSelect = document.createElement('select');
  $productSelect.id = 'product-select';
  $productSelect.className = 'border rounded p-2 mr-2';
  return $productSelect;
};
