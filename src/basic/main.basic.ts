import { products } from './data/product';

let $select, $addToCartButton, $cartItemsContainer, $totalPrice, $stockStatus;
let lastSel,
  bonusPts = 0,
  totalAmt = 0,
  itemCnt = 0;
function main() {
  const $root = document.getElementById('app');
  const $container = document.createElement('div');
  const $wrap = document.createElement('div');
  const $hTxt = document.createElement('h1');
  $cartItemsContainer = document.createElement('div');
  $totalPrice = document.createElement('div');
  $select = document.createElement('select');
  $addToCartButton = document.createElement('button');
  $stockStatus = document.createElement('div');

  $cartItemsContainer.id = 'cart-items';
  $totalPrice.id = 'cart-total';
  $select.id = 'product-select';
  $addToCartButton.id = 'add-to-cart';
  $stockStatus.id = 'stock-status';

  $container.className = 'bg-gray-100 p-8';
  $wrap.className =
    'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8';
  $hTxt.className = 'text-2xl font-bold mb-4';
  $totalPrice.className = 'text-xl font-bold my-4';
  $select.className = 'border rounded p-2 mr-2';
  $addToCartButton.className = 'bg-blue-500 text-white px-4 py-2 rounded';
  $stockStatus.className = 'text-sm text-gray-500 mt-2';
  $hTxt.textContent = '장바구니';
  $addToCartButton.textContent = '추가';

  updateSelOpts();
  $wrap.appendChild($hTxt);
  $wrap.appendChild($cartItemsContainer);
  $wrap.appendChild($totalPrice);
  $wrap.appendChild($select);
  $wrap.appendChild($addToCartButton);
  $wrap.appendChild($stockStatus);
  $container.appendChild($wrap);
  $root.appendChild($container);
  calcCart();
  setTimeout(function () {
    setInterval(function () {
      const luckyItem = products[Math.floor(Math.random() * products.length)];
      if (Math.random() < 0.3 && luckyItem.quantity > 0) {
        luckyItem.originalPrice = Math.round(luckyItem.originalPrice * 0.8);
        alert('번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!');
        updateSelOpts();
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
          alert(suggest.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!');
          suggest.originalPrice = Math.round(suggest.originalPrice * 0.95);
          updateSelOpts();
        }
      }
    }, 60000);
  }, Math.random() * 20000);
}
function updateSelOpts() {
  $select.innerHTML = '';
  products.forEach(function (item) {
    const opt = document.createElement('option');
    opt.value = item.id;
    opt.textContent = item.name + ' - ' + item.originalPrice + '원';
    if (item.quantity === 0) opt.disabled = true;
    $select.appendChild(opt);
  });
}
function calcCart() {
  totalAmt = 0;
  itemCnt = 0;
  const cartItems = $cartItemsContainer.children;
  let subTot = 0;
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
      const itemTot = curItem.originalPrice * q;
      let disc = 0;
      itemCnt += q;
      subTot += itemTot;
      if (q >= 10) {
        if (curItem.id === 'p1') disc = 0.1;
        else if (curItem.id === 'p2') disc = 0.15;
        else if (curItem.id === 'p3') disc = 0.2;
        else if (curItem.id === 'p4') disc = 0.05;
        else if (curItem.id === 'p5') disc = 0.25;
      }
      totalAmt += itemTot * (1 - disc);
    })();
  }
  let discRate = 0;
  if (itemCnt >= 30) {
    const bulkDisc = totalAmt * 0.25;
    const itemDisc = subTot - totalAmt;
    if (bulkDisc > itemDisc) {
      totalAmt = subTot * (1 - 0.25);
      discRate = 0.25;
    } else {
      discRate = (subTot - totalAmt) / subTot;
    }
  } else {
    discRate = (subTot - totalAmt) / subTot;
  }
  if (new Date().getDay() === 2) {
    totalAmt *= 1 - 0.1;
    discRate = Math.max(discRate, 0.1);
  }
  $totalPrice.textContent = '총액: ' + Math.round(totalAmt) + '원';
  if (discRate > 0) {
    const span = document.createElement('span');
    span.className = 'text-green-500 ml-2';
    span.textContent = '(' + (discRate * 100).toFixed(1) + '% 할인 적용)';
    $totalPrice.appendChild(span);
  }
  updateStockInfo();
  renderBonusPts();
}
const renderBonusPts = () => {
  bonusPts = Math.floor(totalAmt / 1000);
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
  const selItem = $select.value;
  const itemToAdd = products.find(function (p) {
    return p.id === selItem;
  });
  if (itemToAdd && itemToAdd.quantity > 0) {
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
    calcCart();
    lastSel = selItem;
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
    calcCart();
  }
});
