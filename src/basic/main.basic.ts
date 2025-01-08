import { Main } from './components/Main';
import { products } from './data/product';
import { renderCartProducts } from './components/renderer/renderCartProducts';
import { renderCartSummary } from './components/renderer/renderCartSummary';
import { Cart } from './stores/cart.store';
import { $ } from './utils/dom.utils';
import { updateSelectOptions } from './utils/select.utils';

let lastSel;

function main() {
  const $root = document.getElementById('app');

  $root.appendChild(Main());

  const $ProductSelect = $<HTMLSelectElement>('#product-select');

  updateSelectOptions($ProductSelect, products);
  renderCartSummary();
  setTimeout(function () {
    setInterval(function () {
      const luckyItem = products[Math.floor(Math.random() * products.length)];

      if (Math.random() < 0.3 && luckyItem.quantity > 0) {
        luckyItem.originalPrice = Math.round(luckyItem.originalPrice * 0.8);
        // alert('번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!');
        updateSelectOptions($ProductSelect, products);
      }
    }, 30000);
  }, Math.random() * 10000);

  setTimeout(function () {
    setInterval(function () {
      if (lastSel) {
        const suggest = products.find(function (item) {
          return item.id !== lastSel && item.quantity > 0;
        });

        if (suggest) {
          // alert(suggest.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!');
          suggest.originalPrice = Math.round(suggest.originalPrice * 0.95);
          updateSelectOptions($ProductSelect, products);
        }
      }
    }, 60000);
  }, Math.random() * 20000);
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
  lastSel = selectedItem;
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
