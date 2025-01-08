import { calculateCart } from '../utils/cartUtils.js';
import { applyPromotions } from '../utils/promotions.js';

export function useCartActions(
  addToCartButton,
  productSelect,
  cartDisplay,
  cartTotal,
  stockInfo,
) {
  let prodList = [
    { id: 'p1', name: '상품1', val: 10000, q: 50 },
    { id: 'p2', name: '상품2', val: 20000, q: 30 },
    { id: 'p3', name: '상품3', val: 30000, q: 20 },
    { id: 'p4', name: '상품4', val: 15000, q: 0 },
    { id: 'p5', name: '상품5', val: 25000, q: 10 },
  ];

  const updateUI = () => {
    calculateCart(prodList, cartDisplay, cartTotal);
    applyPromotions(prodList, productSelect);
  };

  addToCartButton.addEventListener('click', () => {
    const selectedProduct = productSelect.value;
    const product = prodList.find((item) => item.id === selectedProduct);

    if (product && product.q > 0) {
      // Add item logic
      const existingCartItem = cartDisplay.querySelector(`#${product.id}`);
      if (existingCartItem) {
        // Update item's quantity
        const quantitySpan = existingCartItem.querySelector('.item-quantity');
        let quantity = parseInt(quantitySpan.textContent, 10) + 1;
        if (quantity <= product.q) {
          quantitySpan.textContent = `${quantity}`;
          product.q--;
        } else {
          alert('재고가 부족합니다!');
        }
      } else {
        const cartItem = document.createElement('div');
        cartItem.id = product.id;
        cartItem.innerHTML = `
          <span>${product.name} - ${product.val} 원 x 
          <span class="item-quantity">1</span></span>
          <button class="remove-item" data-product-id="${product.id}">삭제</button>
        `;
        cartDisplay.appendChild(cartItem);
        product.q--;
      }
      updateUI();
    }
  });

  cartDisplay.addEventListener('click', (event) => {
    if (event.target.classList.contains('remove-item')) {
      const productId = event.target.getAttribute('data-product-id');
      const product = prodList.find((item) => item.id === productId);

      if (product) {
        const cartItem = cartDisplay.querySelector(`#${productId}`);
        const quantity = parseInt(
          cartItem.querySelector('.item-quantity').textContent,
          10,
        );
        product.q += quantity;
        cartItem.remove();
        updateUI();
      }
    }
  });

  setInterval(() => applyPromotions(prodList, productSelect), 60000);
}
