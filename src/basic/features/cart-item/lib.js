import { isOutOfStock, isOutOfStockRange } from '../../entities/stock/lib.js';

const extractQuantityInformation = (textContent) => {
  const [productLabel, quantityStr] = textContent.split('x ');
  return { productLabel, quantity: parseInt(quantityStr) };
};

const calculateNewQuantity = (currentQuantity, quantityChange) =>
  currentQuantity + quantityChange;

const validateQuantityUpdate = ({
  newQuantity,
  currentQuantity,
  productStock,
}) => {
  if (isOutOfStockRange(newQuantity, productStock + currentQuantity)) {
    return {
      isValid: false,
      shouldRemove: isOutOfStock(newQuantity),
      error: '재고가 부족합니다.',
    };
  }

  return {
    isValid: true,
    shouldRemove: false,
    error: null,
  };
};

export const processQuantityUpdate = ({
  currentText,
  productStock,
  quantityChange,
}) => {
  const { productLabel, quantity } = extractQuantityInformation(currentText);
  const newQuantity = calculateNewQuantity(quantity, quantityChange);
  const validation = validateQuantityUpdate({
    newQuantity,
    currentQuantity: quantity,
    productStock,
  });

  if (!validation.isValid) {
    return {
      ...validation,
      stockChange: 0,
    };
  }

  return {
    isValid: true,
    shouldRemove: false,
    newText: `${productLabel}x ${newQuantity}`,
    stockChange: quantityChange,
  };
};
