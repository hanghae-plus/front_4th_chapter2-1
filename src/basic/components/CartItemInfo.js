export function CartItemInfo({ name, price, quantity = 1 }) {
  return `<span>${name} - ${price}원 x ${quantity}</span>`;
}
