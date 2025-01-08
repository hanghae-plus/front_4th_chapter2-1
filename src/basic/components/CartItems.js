import { CartItem } from './CartItem';
import { renderCartTotal } from './CartTotal';
import { renderStockStatus } from './StockStatus';

export const CartItems = ({ cartItems, productList }) => {
  document.getElementById('app').addEventListener('click', (event) => {
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

      // 수량 변경 이벤트
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
        // 삭제 이벤트
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

  return `
    <div id="cart-items">${[...cartItems]
      .map((cartItem) => {
        return CartItem({ cartItem });
      })
      .join('')}</div>
  `;
};

export const renderCartItems = ({ cartItems }) => {
  const $cartItems = document.getElementById('cart-items');
  $cartItems.innerHTML = '';

  const cartItemTemplate = [...cartItems].map((cartItem) => {
    return CartItem({ cartItem });
  });
  $cartItems.innerHTML = cartItemTemplate.join('');
};
