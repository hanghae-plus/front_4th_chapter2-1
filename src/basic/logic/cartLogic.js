import { CartItem } from '../components/Cart.js';
import { productData } from '../data/data.js';
import { calculateDiscounts } from './discountLogic.js';
import { updateStockInfo } from './stockLogic.js';

//장바구니 총액 및 포인트 계산
export const calculateCart = () => {
  const cartItems = document.getElementById('cart-items');
  const totalSum = document.querySelector('#cart-total span');
  const pointDisplay = document.getElementById('loyalty-points');

  // DOM에서 필요한 데이터 추출
  const items = Array.from(cartItems.children)
    .map((cartItem) => {
      const item = productData.find((p) => p.id === cartItem.id);
      if (!item) return null;

      const selectedQuantity = parseInt(
        cartItem.querySelector('span').textContent.split('x ')[1]
      );
      return { item, selectedQuantity };
    })
    .filter(Boolean);

  // 계산 로직 실행
  const result = calculateDiscounts(items);

  // UI 업데이트
  totalSum.textContent = `총액: ${Math.round(result.totalAmount)}원`;
  pointDisplay.textContent = `(포인트: ${Math.floor(
    result.totalAmount * 0.001
  )})`;

  if (result.discountRate > 0) {
    const discountSpan = document.createElement('span');
    discountSpan.className = 'text-green-500 ml-2';
    discountSpan.textContent = `(${(result.discountRate * 100).toFixed(
      1
    )}% 할인 적용)`;
    totalSum.parentElement.appendChild(discountSpan);
  }
};

//장바구니에 상품 추가
export const addToCart = () => {
  try {
    const cartItems = document.getElementById('cart-items');
    const selectedItem = document.getElementById('product-select').value;
    const itemToAdd = productData.find((p) => p.id === selectedItem);

    if (itemToAdd && itemToAdd.quantity > 0) {
      let existingItem = document.getElementById(itemToAdd.id);

      if (existingItem) {
        // 이미 장바구니에 있는 상품인 경우
        const newQty =
          parseInt(
            existingItem.querySelector('span').textContent.split('x ')[1]
          ) + 1;
        if (newQty <= itemToAdd.quantity) {
          existingItem.querySelector(
            'span'
          ).textContent = `${itemToAdd.name} - ${itemToAdd.price}원 x ${newQty}`;
          itemToAdd.quantity--;
        } else {
          alert('재고가 부족합니다.');
        }
      } else {
        // 새로운 상품 추가
        const newItem = CartItem(itemToAdd);
        cartItems.appendChild(newItem);
        itemToAdd.quantity--;
      }
      return true;
    }
    return false;
  } finally {
    calculateCart();
  }
};

//장바구니 상품 삭제
export const handleCartItemDelete = (productId) => {
  const itemElement = document.getElementById(productId);
  if (!itemElement) return;

  const product = productData.find((p) => p.id === productId);
  const quantity = parseInt(
    itemElement.querySelector('span').textContent.split('x ')[1]
  );

  product.quantity += quantity;
  itemElement.remove();
  calculateCart();
};

//장바구니 상품 수량 업데이트
export const updateCartItemQuantity = (itemId, isIncrease) => {
  const cartItem = document.getElementById(itemId);
  if (!cartItem) return;

  const quantityDisplay = cartItem.querySelector('span');
  const currentQuantity = parseInt(quantityDisplay.textContent.split('x ')[1]);

  const product = productData.find((p) => p.id === itemId);
  if (!product) return;

  // 재고 관련 체크
  if (isIncrease) {
    if (product.quantity <= 0) {
      alert('재고가 부족합니다.');
      return;
    }
  }

  const newQuantity = isIncrease ? currentQuantity + 1 : currentQuantity - 1;

  if (newQuantity > 0) {
    if (isIncrease) {
      product.quantity--;
      updateStockInfo();
    } else {
      product.quantity++;
      updateStockInfo();
    }

    quantityDisplay.textContent = `${product.name} - ${product.price}원 x ${newQuantity}`;
  }
  calculateCart();
};
