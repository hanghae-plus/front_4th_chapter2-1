import { NewCartItem } from "../components/NewCartItem";
import CartItem from "../domain/cart/cart-item";

export const isItemAvailable = (item) => {
  if (!item || item.quantity <= 0) {
    alert("선택한 상품이 없거나 재고가 없습니다.");
    return false;
  }
  return true;
};

export const updateCartItemElement = (itemElement, itemToAdd, quantity) => {
  itemElement.handleChangeSpanTextContent(`${itemToAdd.name} - ${itemToAdd.value}원 x ${quantity}`);
};

export const createNewCartItemElement = (itemToAdd) => {
  return NewCartItem(itemToAdd); // 필요한 경우 NewCartItem의 내부를 확인해 개선 가능
};

export const handleExistingCartItem = (cartItem, itemToAdd, itemElement) => {
  const newQuantity = cartItem.quantity + 1;

  if (newQuantity <= itemToAdd.quantity) {
    itemToAdd.decreaseQuantity();
    cartItem.increaseQuantity();
    updateCartItemElement(itemElement, itemToAdd, newQuantity);
  } else {
    alert("재고가 부족합니다.");
  }
};

export const handleNewCartItem = (itemToAdd, parentElement, cartItems) => {
  const newItemElement = createNewCartItemElement(itemToAdd);
  parentElement.appendChild(newItemElement);
  itemToAdd.decreaseQuantity();
  cartItems.push(
    new CartItem({
      id: itemToAdd.id,
      quantity: 1,
      value: itemToAdd.value,
      name: itemToAdd.name,
    }),
  );
};
