import { PRODUCT_LIST } from './data/productData';
import { eventDiscountLucky, eventDiscountSuggest } from './components/discount';
import { insertProductOptions } from './components/productSets';

var lastSel,
  bonusPts = 0,
  totalAmt = 0,
  itemCnt = 0;
function main() {
  renderCartUi();
  insertProductOptions();
  calcCart();
  eventDiscountLucky();
  eventDiscountSuggest(lastSel);
}

function renderCartUi() {
  const $root = document.getElementById('app');
  const $container = document.createElement('div');
  const $wrap = document.createElement('div');
  const $title = document.createElement('h1');
  const $cartList = document.createElement('div');
  const $cartTotal = document.createElement('div');
  const $productSelect = document.createElement('select');
  const $addCartBtn = document.createElement('button');
  const $stockStatus = document.createElement('div');

  $cartList.id = 'cart-items';
  $cartTotal.id = 'cart-total';
  $productSelect.id = 'product-select';
  $addCartBtn.id = 'add-to-cart';
  $stockStatus.id = 'stock-status';
  $container.className = 'bg-gray-100 p-8';
  $wrap.className =
    'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8';
  $title.className = 'text-2xl font-bold mb-4';
  $cartTotal.className = 'text-xl font-bold my-4';
  $productSelect.className = 'border rounded p-2 mr-2';
  $addCartBtn.className = 'bg-blue-500 text-white px-4 py-2 rounded';
  $stockStatus.className = 'text-sm text-gray-500 mt-2';
  $title.textContent = '장바구니';
  $addCartBtn.textContent = '추가';

  $wrap.appendChild($title);
  $wrap.appendChild($cartList);
  $wrap.appendChild($cartTotal);
  $wrap.appendChild($productSelect);
  $wrap.appendChild($addCartBtn);
  $wrap.appendChild($stockStatus);
  $container.appendChild($wrap);
  $root.appendChild($container);
}


function calcCart() {
  totalAmt = 0;
  itemCnt = 0;
  var cartItems = document.getElementById('cart-items').children;
  var subTot = 0;
  for (var i = 0; i < cartItems.length; i++) {
    (function () {
      var curItem;
      for (var j = 0; j < PRODUCT_LIST.length; j++) {
        if (PRODUCT_LIST[j].id === cartItems[i].id) {
          curItem = PRODUCT_LIST[j];
          break;
        }
      }
      var q = parseInt(
        cartItems[i].querySelector('span').textContent.split('x ')[1]
      );
      var itemTot = curItem.val * q;
      var disc = 0;
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
    var bulkDisc = totalAmt * 0.25;
    var itemDisc = subTot - totalAmt;
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
  document.getElementById('cart-total').textContent =
    '총액: ' + Math.round(totalAmt) + '원';
  if (discRate > 0) {
    var span = document.createElement('span');
    span.className = 'text-green-500 ml-2';
    span.textContent = '(' + (discRate * 100).toFixed(1) + '% 할인 적용)';
    document.getElementById('cart-total').appendChild(span);
  }
  updateStockInfo();
  renderBonusPts();
}
const renderBonusPts = () => {
  bonusPts = Math.floor(totalAmt / 1000);
  var ptsTag = document.getElementById('loyalty-points');
  if (!ptsTag) {
    ptsTag = document.createElement('span');
    ptsTag.id = 'loyalty-points';
    ptsTag.className = 'text-blue-500 ml-2';
    document.getElementById('cart-total').appendChild(ptsTag);
  }
  ptsTag.textContent = '(포인트: ' + bonusPts + ')';
};
function updateStockInfo() {
  var infoMsg = '';
  PRODUCT_LIST.forEach(function (item) {
    if (item.q < 5) {
      infoMsg +=
        item.name +
        ': ' +
        (item.q > 0 ? '재고 부족 (' + item.q + '개 남음)' : '품절') +
        '\n';
    }
  });
  document.getElementById('stock-status').textContent = infoMsg;
}
main();
document.getElementById('add-to-cart').addEventListener('click', function () {
  var selItem = document.getElementById('product-select').value;
  var itemToAdd = PRODUCT_LIST.find(function (p) {
    return p.id === selItem;
  });
  if (itemToAdd && itemToAdd.q > 0) {
    var item = document.getElementById(itemToAdd.id);
    if (item) {
      var newQty =
        parseInt(item.querySelector('span').textContent.split('x ')[1]) + 1;
      if (newQty <= itemToAdd.q) {
        item.querySelector('span').textContent =
          itemToAdd.name + ' - ' + itemToAdd.val + '원 x ' + newQty;
        itemToAdd.q--;
      } else {
        alert('재고가 부족합니다.');
      }
    } else {
      var newItem = document.createElement('div');
      newItem.id = itemToAdd.id;
      newItem.className = 'flex justify-between items-center mb-2';
      newItem.innerHTML =
        '<span>' +
        itemToAdd.name +
        ' - ' +
        itemToAdd.val +
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
      document.getElementById('cart-items').appendChild(newItem);
      itemToAdd.q--;
    }
    calcCart();
    lastSel = selItem;
  }
});
document
  .getElementById('cart-items')
  .addEventListener('click', function (event) {
    var tgt = event.target;
    if (
      tgt.classList.contains('quantity-change') ||
      tgt.classList.contains('remove-item')
    ) {
      var prodId = tgt.dataset.productId;
      var itemElem = document.getElementById(prodId);
      var prod = PRODUCT_LIST.find(function (p) {
        return p.id === prodId;
      });
      if (tgt.classList.contains('quantity-change')) {
        var qtyChange = parseInt(tgt.dataset.change);
        var newQty =
          parseInt(itemElem.querySelector('span').textContent.split('x ')[1]) +
          qtyChange;
        if (
          newQty > 0 &&
          newQty <=
          prod.q +
          parseInt(
            itemElem.querySelector('span').textContent.split('x ')[1]
          )
        ) {
          itemElem.querySelector('span').textContent =
            itemElem.querySelector('span').textContent.split('x ')[0] +
            'x ' +
            newQty;
          prod.q -= qtyChange;
        } else if (newQty <= 0) {
          itemElem.remove();
          prod.q -= qtyChange;
        } else {
          alert('재고가 부족합니다.');
        }
      } else if (tgt.classList.contains('remove-item')) {
        var remQty = parseInt(
          itemElem.querySelector('span').textContent.split('x ')[1]
        );
        prod.q += remQty;
        itemElem.remove();
      }
      calcCart();
    }
  });
