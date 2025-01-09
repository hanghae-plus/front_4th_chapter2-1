import { ProductStore } from '../../store/productStore';
import { renderCalculateCart } from '../cartTotal/renderCalculateCart';
import CartItem from './cartItem/CartItem';
import { updateCartItemQuantity } from './cartItem/updateCartItemQuantity';

export function handleAddToCart() {
  // 선택된 상품 정보 가져오기
  const productSelector = document.getElementById('product-select');
  const selectedItem = productSelector.value;
  const productStore = ProductStore.getInstance();
  const productToAdd = productStore.findProduct(selectedItem);

  if (!(productToAdd && productToAdd.quantity > 0)) return;

  const productElement = document.getElementById(productToAdd.id);

  if (productElement) {
    // 이미 장바구니에 있는 상품인 경우 수량 증가
    const currentQuantity = parseInt(
      productElement.querySelector('span').textContent.split('x ')[1],
    );
    const newQuantity = currentQuantity + 1;

    if (newQuantity <= productToAdd.quantity) {
      // 재고가 충분한 경우 수량 업데이트
      updateCartItemQuantity(productElement, productToAdd, newQuantity);
      productStore.updateProductQuantity(productToAdd.id, -1);
    } else {
      alert(OUT_OF_STOCK_MESSAGE);
    }
  } else {
    // 장바구니에 새로운 상품 추가
    const newProduct = CartItem(productToAdd);
    const cart = document.getElementById('cart-items');
    cart.appendChild(newProduct);
    productStore.updateProductQuantity(productToAdd.id, -1);
  }

  // 장바구니 총액 업데이트 및 마지막 선택 상품 기록
  const products = productStore.getState().products;
  renderCalculateCart(products);

  productStore.setLastSelectedItem(selectedItem);
}
