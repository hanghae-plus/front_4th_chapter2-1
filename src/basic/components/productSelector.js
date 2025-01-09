export function createProductSelector() {
  const selectedProduct = document.createElement('select');
  selectedProduct.id = 'product-select';
  selectedProduct.className = 'border rounded p-2 mr-2';
  return selectedProduct;
}
