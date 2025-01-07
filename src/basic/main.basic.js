import { products } from './data/products';
import { DISCOUNT_POLICY } from './policy/discount';
import { STOCK_POLICY } from './policy/stock';
import { TIMER_POLICY } from './policy/timer';

let productSelector, addToCartButton, cartItemContainer, cartTotal, stockStatus;

let lastSelectedProduct,
  loyaltyPoints = 0,
  amount = 0,
  itemCount = 0;

function main() {
  const root = document.getElementById('app');
  const cont = document.createElement('div');
  const wrap = document.createElement('div');
  const hTxt = document.createElement('h1');
  cartItemContainer = document.createElement('div');
  cartTotal = document.createElement('div');
  productSelector = document.createElement('select');
  addToCartButton = document.createElement('button');
  stockStatus = document.createElement('div');
  cartItemContainer.id = 'cart-items';
  cartTotal.id = 'cart-total';
  productSelector.id = 'product-select';
  addToCartButton.id = 'add-to-cart';
  stockStatus.id = 'stock-status';
  cont.className = 'bg-gray-100 p-8';
  wrap.className = 'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8';
  hTxt.className = 'text-2xl font-bold mb-4';
  cartTotal.className = 'text-xl font-bold my-4';
  productSelector.className = 'border rounded p-2 mr-2';
  addToCartButton.className = 'bg-blue-500 text-white px-4 py-2 rounded';
  stockStatus.className = 'text-sm text-gray-500 mt-2';
  hTxt.textContent = '장바구니';
  addToCartButton.textContent = '추가';
  updateSelOpts();
  wrap.appendChild(hTxt);
  wrap.appendChild(cartItemContainer);
  wrap.appendChild(cartTotal);
  wrap.appendChild(productSelector);
  wrap.appendChild(addToCartButton);
  wrap.appendChild(stockStatus);
  cont.appendChild(wrap);
  root.appendChild(cont);
  calcCart();
  setTimeout(function () {
    setInterval(function () {
      const luckyItem = products[Math.floor(Math.random() * products.length)];
      if (Math.random() < DISCOUNT_POLICY.LIGHTNING_SALE_PROBABILITY && luckyItem.quantity > 0) {
        luckyItem.price = Math.round(luckyItem.price * (1 - DISCOUNT_POLICY.LIGHTNING_SALE));
        alert('번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!');
        updateSelOpts();
      }
    }, TIMER_POLICY.LIGHTNING_SALE_INTERVAL);
  }, Math.random() * 10000);
  setTimeout(function () {
    setInterval(function () {
      if (lastSelectedProduct) {
        const suggest = products.find(function (item) {
          return item.id !== lastSelectedProduct && item.quantity > 0;
        });
        if (suggest) {
          alert(suggest.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!');
          suggest.price = Math.round(suggest.price * (1 - DISCOUNT_POLICY.RECOMMENDATION_DISCOUNT));
          updateSelOpts();
        }
      }
    }, TIMER_POLICY.PRODUCT_RECOMMENDATION_INTERVAL);
  }, Math.random() * 20000);
}

function updateSelOpts() {
  productSelector.innerHTML = '';
  products.forEach(function (item) {
    const opt = document.createElement('option');
    opt.value = item.id;
    opt.textContent = item.name + ' - ' + item.price + '원';
    if (item.quantity === 0) {
      opt.disabled = true;
    }
    productSelector.appendChild(opt);
  });
}

function calcCart() {
  amount = 0;
  itemCount = 0;
  const cartItems = cartItemContainer.children;
  let subTotal = 0;
  for (let i = 0; i < cartItems.length; i++) {
    (function () {
      let curItem;
      for (let j = 0; j < products.length; j++) {
        if (products[j].id === cartItems[i].id) {
          curItem = products[j];
          break;
        }
      }
      const q = parseInt(cartItems[i].querySelector('span').textContent.split('x ')[1]);
      const itemTot = curItem.price * q;
      let disc = 0;
      itemCount += q;
      subTotal += itemTot;
      if (q >= DISCOUNT_POLICY.MIN_QUANTITY_FOR_DISCOUNT) {
        if (curItem.id === 'p1') {
          disc = DISCOUNT_POLICY.PRODUCT_DISCOUNTS.p1;
        } else if (curItem.id === 'p2') {
          disc = DISCOUNT_POLICY.PRODUCT_DISCOUNTS.p2;
        } else if (curItem.id === 'p3') {
          disc = DISCOUNT_POLICY.PRODUCT_DISCOUNTS.p3;
        } else if (curItem.id === 'p4') {
          disc = DISCOUNT_POLICY.PRODUCT_DISCOUNTS.p4;
        } else if (curItem.id === 'p5') {
          disc = DISCOUNT_POLICY.PRODUCT_DISCOUNTS.p5;
        }
      }
      amount += itemTot * (1 - disc);
    })();
  }
  let discRate = 0;
  if (itemCount >= DISCOUNT_POLICY.BULK_PURCHASE_THRESHOLD) {
    const bulkDisc = amount * DISCOUNT_POLICY.BULK_DISCOUNT;
    const itemDisc = subTotal - amount;
    if (bulkDisc > itemDisc) {
      amount = subTotal * (1 - DISCOUNT_POLICY.BULK_DISCOUNT);
      discRate = DISCOUNT_POLICY.BULK_DISCOUNT;
    } else {
      discRate = (subTotal - amount) / subTotal;
    }
  } else {
    discRate = (subTotal - amount) / subTotal;
  }
  if (new Date().getDay() === 2) {
    amount *= 1 - DISCOUNT_POLICY.WEEKLY_DISCOUNT.tuesday;
    discRate = Math.max(discRate, DISCOUNT_POLICY.WEEKLY_DISCOUNT.tuesday);
  }
  cartTotal.textContent = '총액: ' + Math.round(amount) + '원';
  if (discRate > 0) {
    const span = document.createElement('span');
    span.className = 'text-green-500 ml-2';
    span.textContent = '(' + (discRate * 100).toFixed(1) + '% 할인 적용)';
    cartTotal.appendChild(span);
  }
  updateStockInfo();
  renderBonusPts();
}

const renderBonusPts = () => {
  loyaltyPoints = Math.floor(amount / 1000);
  let ptsTag = document.getElementById('loyalty-points');
  if (!ptsTag) {
    ptsTag = document.createElement('span');
    ptsTag.id = 'loyalty-points';
    ptsTag.className = 'text-blue-500 ml-2';
    cartTotal.appendChild(ptsTag);
  }
  ptsTag.textContent = '(포인트: ' + loyaltyPoints + ')';
};

function updateStockInfo() {
  let infoMsg = '';
  products.forEach(function (item) {
    if (item.quantity < STOCK_POLICY.STOCK_THRESHOLD) {
      infoMsg += item.name + ': ' + (item.quantity > 0 ? '재고 부족 (' + item.quantity + '개 남음)' : '품절') + '\n';
    }
  });
  stockStatus.textContent = infoMsg;
}

main();

addToCartButton.addEventListener('click', function () {
  const selItem = productSelector.value;
  const itemToAdd = products.find(function (p) {
    return p.id === selItem;
  });
  if (itemToAdd && itemToAdd.quantity > 0) {
    const item = document.getElementById(itemToAdd.id);
    if (item) {
      const newQty = parseInt(item.querySelector('span').textContent.split('x ')[1]) + 1;
      if (newQty <= itemToAdd.quantity) {
        item.querySelector('span').textContent = itemToAdd.name + ' - ' + itemToAdd.price + '원 x ' + newQty;
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
        itemToAdd.price +
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
      cartItemContainer.appendChild(newItem);
      itemToAdd.quantity--;
    }
    calcCart();
    lastSelectedProduct = selItem;
  }
});

cartItemContainer.addEventListener('click', function (event) {
  const tgt = event.target;
  if (tgt.classList.contains('quantity-change') || tgt.classList.contains('remove-item')) {
    const prodId = tgt.dataset.productId;
    const itemElem = document.getElementById(prodId);
    const prod = products.find(function (p) {
      return p.id === prodId;
    });
    if (tgt.classList.contains('quantity-change')) {
      const qtyChange = parseInt(tgt.dataset.change);
      const newQty = parseInt(itemElem.querySelector('span').textContent.split('x ')[1]) + qtyChange;
      if (newQty > 0 && newQty <= prod.quantity + parseInt(itemElem.querySelector('span').textContent.split('x ')[1])) {
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
    calcCart();
  }
});
