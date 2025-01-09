export default function ProductSelect() {
  const productSelector = document.createElement('select');
  productSelector.id = 'product-select';
  productSelector.className = 'border rounded p-2 mr-2';

  return productSelector;
}
