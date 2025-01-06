import { products } from './data/product';
import { calculateFinalAmount } from './services/calcProductDiscount';
import { Cart } from './stores/cart.store';
import { createElement } from './utils/createElement';
import { updateSelectOptions } from './utils/select.utils';

let $select, $addToCartButton, $cartItemsContainer, $totalPrice, $stockStatus;
let lastSel,
  bonusPts = 0;

function main() {
  const $root = document.getElementById('app');
  const $container = createElement('div', {
    className: 'bg-gray-100 p-8',
  });
  const $wrap = createElement('div', {
    id: 'cart-wrap',
    className: 'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8',
  });
  const $head = createElement('h1', {
    className: 'text-2xl font-bold mb-4',
    textContent: '장바구니',
  });

  $cartItemsContainer = createElement('div', {
    id: 'cart-items',
  });
  $totalPrice = createElement('div', {
    id: 'cart-total',
    className: 'text-xl font-bold my-4',
  });
  $select = createElement('select', {
    id: 'product-select',
    className: 'border rounded p-2 mr-2',
  });
  $addToCartButton = createElement('button', {
    id: 'add-to-cart',
    className: 'bg-blue-500 text-white px-4 py-2 rounded',
    textContent: '추가',
  });
  $stockStatus = createElement('div', {
    id: 'stock-status',
    className: 'text-sm text-gray-500 mt-2',
  });

  updateSelectOptions($select, products);

  $wrap.appendChild($head);
  $wrap.appendChild($cartItemsContainer);
  $wrap.appendChild($totalPrice);
  $wrap.appendChild($select);
  $wrap.appendChild($addToCartButton);
  $wrap.appendChild($stockStatus);
  $container.appendChild($wrap);
  $root.appendChild($container);

  calculateCartTotalAndDiscount();
  setTimeout(function () {
    setInterval(function () {
      const luckyItem = products[Math.floor(Math.random() * products.length)];

      if (Math.random() < 0.3 && luckyItem.quantity > 0) {
        luckyItem.originalPrice = Math.round(luckyItem.originalPrice * 0.8);
        // alert('번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!');
        updateSelectOptions($select, products);
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
          updateSelectOptions($select, products);
        }
      }
    }, 60000);
  }, Math.random() * 20000);
}

function calculateCartTotalAndDiscount() {
  const { amount, discountRate } = calculateFinalAmount(Cart.items);

  $totalPrice.textContent = '총액: ' + Math.round(amount) + '원';
  if (discountRate > 0) {
    const span = document.createElement('span');

    span.className = 'text-green-500 ml-2';
    span.textContent = '(' + (discountRate * 100).toFixed(1) + '% 할인 적용)';
    $totalPrice.appendChild(span);
  }
  updateStockInfo();
  renderBonusPts(amount);
}

const renderBonusPts = (totalAmount: number) => {
  bonusPts = Math.floor(totalAmount / 1000);
  let ptsTag = document.getElementById('loyalty-points');

  if (!ptsTag) {
    ptsTag = document.createElement('span');
    ptsTag.id = 'loyalty-points';
    ptsTag.className = 'text-blue-500 ml-2';
    $totalPrice.appendChild(ptsTag);
  }
  ptsTag.textContent = '(포인트: ' + bonusPts + ')';
};

function updateStockInfo() {
  let infoMsg = '';

  products.forEach(function (item) {
    if (item.quantity < 5) {
      infoMsg +=
        item.name +
        ': ' +
        (item.quantity > 0 ? '재고 부족 (' + item.quantity + '개 남음)' : '품절') +
        '\n';
    }
  });
  $stockStatus.textContent = infoMsg;
}
main();
$addToCartButton.addEventListener('click', function () {
  const selectedItem = $select.value;
  const itemToAdd = products.find(function (p) {
    return p.id === selectedItem;
  });

  if (itemToAdd && itemToAdd.quantity > 0) {
    Cart.addItem(itemToAdd);
    const item = document.getElementById(itemToAdd.id);

    if (item) {
      const newQty = parseInt(item.querySelector('span').textContent.split('x ')[1]) + 1;

      if (newQty <= itemToAdd.quantity) {
        item.querySelector('span').textContent =
          itemToAdd.name + ' - ' + itemToAdd.originalPrice + '원 x ' + newQty;
        itemToAdd.quantity--;
      } else {
        alert('재고가 부족합니다.');
      }
    } else {
      const newItem = document.createElement('div');

      newItem.id = itemToAdd.id;
      newItem.className = 'flex justify-between items-center mb-2';
      newItem.innerHTML =
        '<span>' +
        itemToAdd.name +
        ' - ' +
        itemToAdd.originalPrice +
        '원 x 1</span><div>' +
        '<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="' +
        itemToAdd.id +
        '" data-change="-1">-</button>' +
        '<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="' +
        itemToAdd.id +
        '" data-change="1">+</button>' +
        '<button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="' +
        itemToAdd.id +
        '">삭제</button></div>';
      $cartItemsContainer.appendChild(newItem);
      itemToAdd.quantity--;
    }
    calculateCartTotalAndDiscount();
    lastSel = selectedItem;
  }
});
$cartItemsContainer.addEventListener('click', function (event) {
  const tgt = event.target;

  if (tgt.classList.contains('quantity-change') || tgt.classList.contains('remove-item')) {
    const prodId = tgt.dataset.productId;
    const itemElem = document.getElementById(prodId);
    const prod = products.find(function (p) {
      return p.id === prodId;
    });

    if (tgt.classList.contains('quantity-change')) {
      const qtyChange = parseInt(tgt.dataset.change);
      const newQty =
        parseInt(itemElem.querySelector('span').textContent.split('x ')[1]) + qtyChange;

      if (
        newQty > 0 &&
        newQty <=
          prod.quantity + parseInt(itemElem.querySelector('span').textContent.split('x ')[1])
      ) {
        itemElem.querySelector('span').textContent =
          itemElem.querySelector('span').textContent.split('x ')[0] + 'x ' + newQty;
        prod.quantity -= qtyChange;
      } else if (newQty <= 0) {
        itemElem.remove();
        prod.quantity -= qtyChange;
      } else {
        alert('재고가 부족합니다.');
      }
    } else if (tgt.classList.contains('remove-item')) {
      const remQty = parseInt(itemElem.querySelector('span').textContent.split('x ')[1]);

      prod.quantity += remQty;
      itemElem.remove();
    }
    calculateCartTotalAndDiscount();
  }
});
