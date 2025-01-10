export const isCartAction = (target) => {
  return target.classList.contains("quantity-change") || target.classList.contains("remove-item");
};

export const isQuantityChangeAction = (target) => {
  return target.classList.contains("quantity-change");
};

export const isRemoveAction = (target) => {
  return target.classList.contains("remove-item");
};

export const updateItemElement = (itemElement, cartItem, newQuantity) => {
  itemElement.handleChangeSpanTextContent(`상품${cartItem.id[1]} - ${cartItem.value}원 x ${newQuantity}`);
};

export const removeItemElement = (itemElement, product, cartItem, quantityChange) => {
  itemElement.remove();
  product.decreaseQuantity(quantityChange);
  cartItem.increaseQuantity(quantityChange);
};

export const handleQuantityChange = (target, product, cartItem, itemElement) => {
  const quantityChange = parseInt(target.dataset.change, 10);
  const newQuantity = cartItem.quantity + quantityChange;

  if (newQuantity > 0 && newQuantity <= product.quantity + cartItem.quantity) {
    updateItemElement(itemElement, cartItem, newQuantity);
    product.decreaseQuantity(quantityChange);
    cartItem.increaseQuantity(quantityChange);
  } else if (newQuantity <= 0) {
    removeItemElement(itemElement, product, cartItem, quantityChange);
  } else {
    alert("재고가 부족합니다.");
  }
};

export const handleRemoveAction = (product, cartItem, itemElement, cartItems) => {
  product.increaseQuantity(cartItem.quantity);
  itemElement.remove();
  cartItems.removeItem(cartItem);
};
