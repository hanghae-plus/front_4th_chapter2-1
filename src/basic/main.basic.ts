import { Main } from './components/Main';
import { renderCartSummary } from './components/renderer/renderCartSummary';
import { renderSelectOptions } from './components/renderer/renderer';
import { addToCart, changeQuantity, removeFromCart } from './services/cartService';
import { startFlashSale } from './services/startFlashSale';
import { startSuggestionSale } from './services/startSuggestionSale';
import { Cart } from './stores/cart.store';
import { Products } from './stores/product.store';
import { $ } from './utils/dom.utils';

function main() {
  const $root = document.getElementById('app');

  $root.appendChild(Main());

  renderSelectOptions(Products.items);
  renderCartSummary();

  startFlashSale(Products.items);
  startSuggestionSale(Products.items, () => Cart.lastSelectedId);
}

main();

$('#add-to-cart').addEventListener('click', () => {
  const $select = $<HTMLSelectElement>('#product-select');
  const selectedItem = $select.value;

  addToCart(selectedItem, 1);
  renderCartSummary();
});

$('#cart-items').addEventListener('click', (event) => {
  const target = event.target as HTMLElement;

  if (!target.classList.contains('quantity-change') && !target.classList.contains('remove-item')) {
    return;
  }

  const productId = target.dataset.productId;

  if (target.classList.contains('quantity-change')) {
    const quantityDelta = parseInt(target.dataset.change) as 1 | -1;

    changeQuantity(productId, quantityDelta);
  } else if (target.classList.contains('remove-item')) {
    removeFromCart(productId);
  }
  renderCartSummary();
});
