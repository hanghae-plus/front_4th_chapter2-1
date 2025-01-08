import { createCartItemElement } from './cartItem';
import { renderCartTotal } from './cartTotal';
import { renderStockStatus } from './stockStatus';

export const createCartItemsElement = ({ cartItems, productList }) => {
  const $cartItems = document.createElement('div');
  $cartItems.id = 'cart-items';

  $cartItems.addEventListener('click', (event) => {
    const $targetElement = event.target;
    if (
      $targetElement.classList.contains('quantity-change') ||
      $targetElement.classList.contains('remove-item')
    ) {
      const productId = $targetElement.dataset.productId;
      const $cartItem = document.getElementById(productId);
      const cartItem = [...cartItems].find((item) => {
        return item.id === productId;
      });
      const product = productList.find((product) => {
        return product.id === productId;
      });
      if ($targetElement.classList.contains('quantity-change')) {
        const orderUnit = parseInt($targetElement.dataset.change);
        const newQuantity = cartItem.quantity + orderUnit;
        if (
          newQuantity > 0 &&
          newQuantity <= product.stock + cartItem.quantity
        ) {
          // renderCartItems({ cartItems: cartItems });를 사용하면 추가되면서 버튼이 새로 생성되면서, 테스트케이스가 실패함.
          $cartItem.querySelector('span').textContent =
            `${product.name} - ${product.price}원 x ${newQuantity}`;

          cartItem.quantity = newQuantity;
          product.stock -= orderUnit;
        } else if (newQuantity <= 0) {
          cartItems.forEach((item) => {
            if (item.id === productId) {
              cartItems.delete(item);
            }
          });
          renderCartItems({ cartItems: cartItems });

          product.stock -= orderUnit;
        } else {
          alert('재고가 부족합니다.');
        }
      } else if ($targetElement.classList.contains('remove-item')) {
        product.stock += cartItem.quantity;
        cartItems.forEach((item) => {
          if (item.id === productId) {
            cartItems.delete(item);
          }
        });

        renderCartItems({ cartItems: cartItems });
      }
      renderCartTotal({ cartItems: cartItems });
      renderStockStatus({ productList: productList });
    }
  });

  return $cartItems;
};

export const renderCartItems = ({ cartItems }) => {
  const $cartItems = document.getElementById('cart-items');
  $cartItems.innerHTML = '';

  cartItems.forEach((cartItem) => {
    const $cartItem = createCartItemElement({ cartItem });
    $cartItems.appendChild($cartItem);
  });
};
