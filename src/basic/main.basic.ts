import { Main } from './components/Main';
import { renderCartProducts } from './components/renderer/renderCartProducts';
import { renderCartSummary } from './components/renderer/renderCartSummary';
import { renderSelectOptions } from './components/renderer/renderer';
import { products } from './data/product';
import { startFlashSale } from './services/startFlashSale';
import { startSuggestionSale } from './services/startSuggestionSale';
import { Cart } from './stores/cart.store';
import { $ } from './utils/dom.utils';

function main() {
  const $root = document.getElementById('app');

  $root.appendChild(Main());

  renderSelectOptions(products);
  renderCartSummary();

  startFlashSale(products);
  startSuggestionSale(products, () => Cart.lastSelectedId);
}

main();

$('#add-to-cart').addEventListener('click', () => {
  const $select = $<HTMLSelectElement>('#product-select');
  const selectedItem = $select.value;
  const itemToAdd = products.find((item) => item.id === selectedItem);
  const $cartProductList = $('#cart-items');

  if (itemToAdd && itemToAdd.quantity > 0) {
    Cart.addItem(itemToAdd);
    itemToAdd.quantity--;
    renderCartProducts($cartProductList, Cart.items);
  } else {
    alert('재고가 부족합니다');
  }
  renderCartSummary();
});

$('#cart-items').addEventListener('click', (event) => {
  const target = event.target as HTMLElement;

  if (!target.classList.contains('quantity-change') && !target.classList.contains('remove-item')) {
    return;
  }

  const productId = target.dataset.productId;
  const selectedProduct = products.find((product) => product.id === productId);
  const $cartProductList = $('#cart-items');

  if (target.classList.contains('quantity-change')) {
    const quantityDelta = parseInt(target.dataset.change);

    if (quantityDelta === 1 && selectedProduct.quantity > 0) {
      Cart.addItem(selectedProduct, quantityDelta);
      selectedProduct.quantity -= quantityDelta;
    } else if (quantityDelta === -1) {
      Cart.decreaseItemQuantity(productId, 1);
      selectedProduct.quantity -= quantityDelta;
    } else {
      alert('재고가 부족합니다');
    }
  } else if (target.classList.contains('remove-item')) {
    const removedQuantity = Cart.getItem(productId)?.quantity;

    selectedProduct.quantity += removedQuantity;
    Cart.removeItem(productId);
  }
  renderCartProducts($cartProductList, Cart.items);
  renderCartSummary();
});
