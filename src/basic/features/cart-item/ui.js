import { processQuantityUpdate } from './lib.js';

export const updateProductQuantity = ({
  productElement,
  product,
  newQuantity,
}) => {
  const spanElement = productElement.querySelector('span');

  const result = processQuantityUpdate({
    currentText: spanElement.textContent,
    productStock: product.quantity,
    quantityChange: newQuantity,
  });
  if (!result.isValid) {
    alert(result.error);
    return;
  }

  if (result.shouldRemove) {
    productElement.remove();
  } else {
    spanElement.textContent = result.newText;
  }

  product.quantity -= result.stockChange;
};
