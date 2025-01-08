import { helper } from '../../utils/helper';

export default function ProductSelectOption(product) {
  const productSelect = document.createElement('option');

  productSelect.value = product.id;
  productSelect.textContent = helper.getNameAndPriceMessage(
    product.name,
    product.price,
  );
  if (product.quantity === 0) {
    productSelect.disabled = true;
  }

  return productSelect;
}
