import { appendChildren, createElement } from './utils/dom';
import { updateProductSelectOptions } from './services/updateProductSelectOptions';
import { renderBonusPoints } from './services/renderBonusPoints';
import { updateStockInfo } from './services/updateStockInfo';
import { appendDiscountedRateTag } from './services/appendDiscountedRateTag';
import { DayOfWeek } from './constants/date-contants';
import {
  Discount,
  MIN_QUANTITY_FOR_BULK_DISCOUNT,
  MIN_QUANTITY_FOR_PRODUCT_DISCOUNT,
} from './constants/discount-contants';

var prodList, sel, addBtn, cartDisp, sum, stockInfo;

var lastSel,
  bonusPts = 0,
  totalAmt = 0,
  itemCnt = 0;

function main() {
  prodList = [
    { id: 'p1', name: '상품1', val: 10000, q: 50 },
    { id: 'p2', name: '상품2', val: 20000, q: 30 },
    { id: 'p3', name: '상품3', val: 30000, q: 20 },
    { id: 'p4', name: '상품4', val: 15000, q: 0 },
    { id: 'p5', name: '상품5', val: 25000, q: 10 },
  ];

  const $root = document.getElementById('app');

  const $cont = createElement('div', {
    className: 'bg-gray-100 p-8',
  });

  const $wrap = createElement('div', {
    className: 'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8',
  });

  const $hTxt = createElement('h1', {
    className: 'text-2xl font-bold mb-4',
    textContent: '장바구니',
  });

  cartDisp = createElement('div', {
    id: 'cart-items',
  });

  sum = createElement('div', {
    id: 'cart-total',
    className: 'text-xl font-bold my-4',
  });

  sel = createElement('select', {
    id: 'product-select',
    className: 'border rounded p-2 mr-2',
  });

  addBtn = createElement('button', {
    id: 'add-to-cart',
    className: 'bg-blue-500 text-white px-4 py-2 rounded',
    textContent: '추가',
  });

  stockInfo = createElement('div', {
    id: 'stock-status',
    className: 'text-sm text-gray-500 mt-2',
  });

  appendChildren($wrap, [$hTxt, cartDisp, sum, sel, addBtn, stockInfo]);

  $cont.appendChild($wrap);

  $root.appendChild($cont);

  updateProductSelectOptions(sel, prodList);

  calcCart();

  setTimeout(function () {
    setInterval(function () {
      var luckyItem = prodList[Math.floor(Math.random() * prodList.length)];
      if (Math.random() < 0.3 && luckyItem.q > 0) {
        luckyItem.val = Math.round(luckyItem.val * 0.8);
        alert('번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!');
        updateProductSelectOptions(sel, prodList);
      }
    }, 30000);
  }, Math.random() * 10000);

  setTimeout(function () {
    setInterval(function () {
      if (lastSel) {
        var suggest = prodList.find(function (item) {
          return item.id !== lastSel && item.q > 0;
        });
        if (suggest) {
          alert(suggest.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!');
          suggest.val = Math.round(suggest.val * 0.95);
          updateProductSelectOptions(sel, prodList);
        }
      }
    }, 60000);
  }, Math.random() * 20000);
}

function calcCart() {
  totalAmt = 0;
  itemCnt = 0;

  var cartItems = cartDisp.children;
  var subTot = 0;

  for (var i = 0; i < cartItems.length; i++) {
    (function () {
      var curItem;
      for (var j = 0; j < prodList.length; j++) {
        if (prodList[j].id === cartItems[i].id) {
          curItem = prodList[j];
          break;
        }
      }
      // TODO: 여기부터 리팩토링 다시 시작. 함수 추출 하고 subTot 변수명 수정 하기.
      var q = parseInt(cartItems[i].querySelector('span').textContent.split('x ')[1]);
      var itemTot = curItem.val * q;
      var disc = 0;
      itemCnt += q;
      subTot += itemTot;

      if (q >= MIN_QUANTITY_FOR_PRODUCT_DISCOUNT) {
        if (curItem.id === 'p1') disc = Discount.P1Discount;
        else if (curItem.id === 'p2') disc = Discount.P2Discount;
        else if (curItem.id === 'p3') disc = Discount.P3Discount;
        else if (curItem.id === 'p4') disc = Discount.P4Discount;
        else if (curItem.id === 'p5') disc = Discount.P5Discount;
      }

      totalAmt += itemTot * (1 - disc);
    })();
  }

  let discRate = 0;

  if (itemCnt >= MIN_QUANTITY_FOR_BULK_DISCOUNT) {
    var bulkDisc = totalAmt * Discount.BulkDiscount;
    var itemDisc = subTot - totalAmt;

    if (bulkDisc > itemDisc) {
      totalAmt = subTot * (1 - Discount.BulkDiscount);
      discRate = Discount.BulkDiscount;
    } else {
      discRate = (subTot - totalAmt) / subTot;
    }
  } else {
    discRate = (subTot - totalAmt) / subTot;
  }

  if (new Date().getDay() === DayOfWeek.Tuesday) {
    totalAmt *= 1 - Discount.TuesdayDiscount;
    discRate = Math.max(discRate, Discount.TuesdayDiscount);
  }

  sum.textContent = '총액: ' + Math.round(totalAmt) + '원';

  if (discRate > 0) {
    appendDiscountedRateTag(sum, discRate);
  }

  updateStockInfo(stockInfo, prodList);
  renderBonusPoints(sum, totalAmt);
}

main();

addBtn.addEventListener('click', function () {
  var selItem = sel.value;
  var itemToAdd = prodList.find(function (p) {
    return p.id === selItem;
  });
  if (itemToAdd && itemToAdd.q > 0) {
    var item = document.getElementById(itemToAdd.id);
    if (item) {
      var newQty = parseInt(item.querySelector('span').textContent.split('x ')[1]) + 1;
      if (newQty <= itemToAdd.q) {
        item.querySelector('span').textContent = itemToAdd.name + ' - ' + itemToAdd.val + '원 x ' + newQty;
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
      cartDisp.appendChild(newItem);
      itemToAdd.q--;
    }
    calcCart();
    lastSel = selItem;
  }
});
cartDisp.addEventListener('click', function (event) {
  var tgt = event.target;
  if (tgt.classList.contains('quantity-change') || tgt.classList.contains('remove-item')) {
    var prodId = tgt.dataset.productId;
    var itemElem = document.getElementById(prodId);
    var prod = prodList.find(function (p) {
      return p.id === prodId;
    });
    if (tgt.classList.contains('quantity-change')) {
      var qtyChange = parseInt(tgt.dataset.change);
      var newQty = parseInt(itemElem.querySelector('span').textContent.split('x ')[1]) + qtyChange;
      if (newQty > 0 && newQty <= prod.q + parseInt(itemElem.querySelector('span').textContent.split('x ')[1])) {
        itemElem.querySelector('span').textContent =
          itemElem.querySelector('span').textContent.split('x ')[0] + 'x ' + newQty;
        prod.q -= qtyChange;
      } else if (newQty <= 0) {
        itemElem.remove();
        prod.q -= qtyChange;
      } else {
        alert('재고가 부족합니다.');
      }
    } else if (tgt.classList.contains('remove-item')) {
      var remQty = parseInt(itemElem.querySelector('span').textContent.split('x ')[1]);
      prod.q += remQty;
      itemElem.remove();
    }
    calcCart();
  }
});
