import Cart from './components/cart/Cart';
import CartAddButton from './components/cartAddButton/CartAddButton';
import CartTotal from './components/cartTotal/CartTotal';
import { renderCalculateCart } from './components/cartTotal/renderCalculateCart';
import Container from './components/Container';
import ContentWrapper from './components/ContentWrapper';
import Header from './components/Header';
import { updateSelectOptions } from './components/productSelect/updateSelectOptions';
import ProductSelector from './components/productSelector/ProductSelector';
import StockStatus from './components/stockStatus/StockStatus';
import { CONSTANTS } from './constants';
import { ProductStore } from './store/productStore';
import { helper } from './utils/helper';

function main() {
  const contentWrapper = ContentWrapper();

  contentWrapper.appendChild(Header({ title: '장바구니' }));
  contentWrapper.appendChild(Cart());
  contentWrapper.appendChild(CartTotal());
  contentWrapper.appendChild(ProductSelector());
  contentWrapper.appendChild(CartAddButton());
  contentWrapper.appendChild(StockStatus());

  const containerDiv = Container();
  containerDiv.appendChild(contentWrapper);

  const root = document.getElementById('app');
  root.appendChild(containerDiv);

  const productStore = ProductStore.getInstance();
  const products = productStore.getState().products;
  const lastSelectedItem = productStore.getState().lastSelectedItem;

  updateSelectOptions(products);
  renderCalculateCart(products);

  setTimeout(function () {
    setInterval(function () {
      const luckyItem = products[Math.floor(Math.random() * products.length)];

      if (
        Math.random() < CONSTANTS.RANDOM_SALE_RATE &&
        luckyItem.quantity > 0
      ) {
        luckyItem.price = Math.round(
          luckyItem.price * CONSTANTS.LIGHTNING_SALE_RATE,
        );
        alert(helper.getLightningSaleMessage(luckyItem.name));
        updateSelectOptions(products);
      }
    }, CONSTANTS.LIGHTNING_SALE_INTERVAL);
  }, Math.random() * CONSTANTS.LIGHTNING_SALE_DELAY);

  setTimeout(function () {
    setInterval(function () {
      if (lastSelectedItem) {
        const suggest = products.find(function (item) {
          return item.id !== lastSelectedItem && item.quantity > 0;
        });

        if (suggest) {
          alert(helper.getSuggestionMessage(suggest.name));
          suggest.price = Math.round(
            suggest.price * CONSTANTS.SUGGESTION_DISCOUNT_RATE,
          );
          updateSelectOptions(products);
        }
      }
    }, CONSTANTS.SUGGESTION_INTERVAL);
  }, Math.random() * CONSTANTS.SUGGESTION_DELAY);
}

main();

// 장바구니 내 상품 조작 이벤트 (수량 변경, 삭제)
const cart = document.getElementById('cart-items');
cart.addEventListener('click', function (event) {
  const targetElement = event.target;

  // 수량 변경 또는 삭제 버튼 클릭 확인
  if (
    targetElement.classList.contains('quantity-change') ||
    targetElement.classList.contains('remove-item')
  ) {
    // 조작할 상품 정보 가져오기
    const productId = targetElement.dataset.productId;
    const cartProductElement = document.getElementById(productId);
    const productStore = ProductStore.getInstance();
    const products = productStore.getState().products;
    const selectedProduct = products.find(product => product.id === productId);

    if (targetElement.classList.contains('quantity-change')) {
      // 수량 변경 처리
      const quantityChange = parseInt(targetElement.dataset.change);
      const quantity = parseInt(
        cartProductElement.querySelector('span').textContent.split('x ')[1],
      );
      const newQuantity = quantity + quantityChange;

      if (
        // 수량이 유효한 범위인 경우 (0보다 크고 재고보다 적은 경우)
        newQuantity > 0 &&
        newQuantity <= selectedProduct.quantity + quantity
      ) {
        // UI 업데이트 및 상태 변경
        cartProductElement.querySelector('span').textContent =
          `${cartProductElement.querySelector('span').textContent.split('x ')[0]}x ${newQuantity}`;
        productStore.updateProductQuantity(selectedProduct.id, -quantityChange);
      } else if (newQuantity <= 0) {
        // 수량이 0 이하가 되는 경우 상품 제거
        cartProductElement.remove();
        productStore.updateProductQuantity(selectedProduct.id, -quantityChange);
      } else {
        // 재고 부족 알림
        alert(CONSTANTS.OUT_OF_STOCK_MESSAGE);
      }
    } else if (targetElement.classList.contains('remove-item')) {
      // 상품 삭제 처리
      const removedQuantity = parseInt(
        cartProductElement.querySelector('span').textContent.split('x ')[1],
      );
      productStore.updateProductQuantity(selectedProduct.id, removedQuantity);
      cartProductElement.remove();
    }

    // 장바구니 총액 업데이트
    renderCalculateCart(products);
  }
});
