var prodList, sel, addBtn, cartDisp, sum, stockInfo;
var lastSel,
  bonusPoint = 0,
  totalAmt = 0,
  itemCnt = 0;
function main() {
  prodList = [
    { id: 'p1', name: '상품1', val: 10000, q: 50 },
    { id: 'p2', name: '상품2', val: 20000, q: 30 },
    { id: 'p3', name: '상품3', val: 30000, q: 20 },
    { id: 'p4', name: '상품4', val: 15000, q: 0 },
    { id: 'p5', name: '상품5', val: 25000, q: 10 }
  ];
  var root = document.getElementById('app');
  let cont = document.createElement('div');
  var wrap = document.createElement('div');
  let hTxt = document.createElement('h1');
  cartDisp = document.createElement('div');
  sum = document.createElement('div');
  sel = document.createElement('select');
  addBtn = document.createElement('button');
  stockInfo = document.createElement('div');
  cartDisp.id = 'cart-items';
  sum.id = 'cart-total';
  sel.id = 'product-select';
  addBtn.id = 'add-to-cart';
  stockInfo.id = 'stock-status';
  cont.className = 'bg-gray-100 p-8';
  wrap.className =
    'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8';
  hTxt.className = 'text-2xl font-bold mb-4';
  sum.className = 'text-xl font-bold my-4';
  sel.className = 'border rounded p-2 mr-2';
  addBtn.className = 'bg-blue-500 text-white px-4 py-2 rounded';
  stockInfo.className = 'text-sm text-gray-500 mt-2';
  hTxt.textContent = '장바구니';
  addBtn.textContent = '추가';
  updateSelOpts();
  wrap.appendChild(hTxt);
  wrap.appendChild(cartDisp);
  wrap.appendChild(sum);
  wrap.appendChild(sel);
  wrap.appendChild(addBtn);
  wrap.appendChild(stockInfo);
  cont.appendChild(wrap);
  root.appendChild(cont);
  calcCart();
  setTimeout(function () {
    setInterval(function () {
      var luckyItem = prodList[Math.floor(Math.random() * prodList.length)];
      if (Math.random() < 0.3 && luckyItem.q > 0) {
        luckyItem.val = Math.round(luckyItem.val * 0.8);
        alert('번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!');
        updateSelOpts();
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
          alert(
            suggest.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!'
          );
          suggest.val = Math.round(suggest.val * 0.95);
          updateSelOpts();
        }
      }
    }, 60000);
  }, Math.random() * 20000);
}
function updateSelOpts() {
  sel.innerHTML = '';
  prodList.forEach(function (item) {
    var opt = document.createElement('option');
    opt.value = item.id;
    opt.textContent = item.name + ' - ' + item.val + '원';
    if (item.q === 0) opt.disabled = true;
    sel.appendChild(opt);
  });
}

//calcCart refactor

const BULK_AMOUNT = 30;
const BULK_DISCOUNT_RATE = 0.25;
const SPECIAL_DAY = 2;
const SPECIAL_DAY_DISCOUNT_RATE = 0.1;

function calcCart() {
  totalAmt = 0;
  itemCnt = 0;

  let totalAmtBeforeDisc = 0;
  let discRate = 0;

  const cartItems = Array.from(cartDisp.children);

  cartItems.forEach((cartItem) => {
    const currentItem = findProductById(cartItem.id);
    if (!currentItem) return;

    const quantity = parseInt(
      cartItem.querySelector('span').textContent.split('x ')[1],
      10
    );
    const itemTotal = currentItem.val * quantity;
    const discountRate = getDiscountRate(currentItem.id, quantity);

    totalAmt += itemTotal * (1 - discountRate);

    totalAmtBeforeDisc += itemTotal;
    itemCnt += quantity;
  });

  discRate = applyBulkDiscount(totalAmt, itemCnt, totalAmtBeforeDisc, discRate);
  ({ totalAmt, discRate } = applySpecialdayDiscount(totalAmt, discRate));

  updateCartUI(totalAmt, discRate);
  updateStockInfoUI();
  updatePointUI();
}

const findProductById = (productId) => {
  return prodList.find((product) => product.id === productId);
};

const getDiscountRate = (productId, quantity) => {
  const DISCOUNT_RATES = {
    p1: 0.1,
    p2: 0.15,
    p3: 0.2,
    p4: 0.05,
    p5: 0.25
  };

  if (quantity >= 10 && DISCOUNT_RATES[productId]) {
    return DISCOUNT_RATES[productId];
  }
  return 0;
};

const applyBulkDiscount = (totalAmt, itemCnt, totalAmtBeforeDisc, discRate) => {
  if (totalAmtBeforeDisc === 0) return 0;

  const calDefaultDiscRate = () =>
    (totalAmtBeforeDisc - totalAmt) / totalAmtBeforeDisc;

  if (itemCnt >= BULK_AMOUNT) {
    const bulkDiscountAmount = totalAmtBeforeDisc * BULK_DISCOUNT_RATE;
    const currentDiscountAmount = totalAmtBeforeDisc - totalAmt;

    if (bulkDiscountAmount > currentDiscountAmount) {
      totalAmt = totalAmtBeforeDisc * (1 - BULK_DISCOUNT_RATE);
      return BULK_DISCOUNT_RATE;
    }
  }

  return calDefaultDiscRate();
};

const applySpecialdayDiscount = (totalAmt, discRate) => {
  const today = new Date().getDay();

  if (today === SPECIAL_DAY) {
    totalAmt *= 1 - SPECIAL_DAY_DISCOUNT_RATE;
    discRate = Math.max(discRate, SPECIAL_DAY_DISCOUNT_RATE);
  }

  return { totalAmt, discRate };
};

const updateCartUI = (finalTotal, discountRate) => {
  sum.textContent = `총액: ${Math.round(finalTotal)}원`;

  if (discountRate > 0) {
    const discountTag = document.createElement('span');
    discountTag.className = 'text-green-500 ml-2';
    discountTag.textContent = `(${(discountRate * 100).toFixed(1)}% 할인 적용)`;
    sum.appendChild(discountTag);
  }
};

//calcCart refactor

const updatePointUI = () => {
  bonusPoint = Math.floor(totalAmt / 1000);
  let pointTag = document.getElementById('loyalty-points');

  if (!pointTag) {
    pointTag = document.createElement('span');
    pointTag.id = 'loyalty-points';
    pointTag.className = 'text-blue-500 ml-2';
    sum.appendChild(pointTag);
  }

  pointTag.textContent = '(포인트: ' + bonusPoint + ')';
};

//updateStockInfoUI

const updateStockInfoUI = () => {
  const lowStockItems = getLowStockItems(prodList);

  const stockInfoTag = lowStockItems
    .map(
      (item) =>
        `${item.name}: ${item.q > 0 ? `재고 부족 (${item.q}개 남음)` : '품절'}`
    )
    .join('\n');

  stockInfo.textContent = stockInfoTag;
};

const getLowStockItems = (prodList) => {
  return prodList.filter((it) => it.q < 5);
};
//updateStockInfoUI
main();
addBtn.addEventListener('click', function () {
  var selItem = sel.value;
  var itemToAdd = prodList.find(function (p) {
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
      cartDisp.appendChild(newItem);
      itemToAdd.q--;
    }
    calcCart();
    lastSel = selItem;
  }
});
cartDisp.addEventListener('click', function (event) {
  var tgt = event.target;
  if (
    tgt.classList.contains('quantity-change') ||
    tgt.classList.contains('remove-item')
  ) {
    var prodId = tgt.dataset.productId;
    var itemElem = document.getElementById(prodId);
    var prod = prodList.find(function (p) {
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
            parseInt(itemElem.querySelector('span').textContent.split('x ')[1])
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
