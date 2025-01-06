let prodList, prodSelect, addBtn, cartDisp, cartTotal, stockInfo;
let lastSel,
  bonusPoint = 0,
  totalAmt = 0,
  itemCnt = 0;
function main() {
  prodList = [
    { id: 'p1', name: '상품1', price: 10000, volume: 50 },
    { id: 'p2', name: '상품2', price: 20000, volume: 30 },
    { id: 'p3', name: '상품3', price: 30000, volume: 20 },
    { id: 'p4', name: '상품4', price: 15000, volume: 0 },
    { id: 'p5', name: '상품5', price: 25000, volume: 10 }
  ];
  let root = document.getElementById('app');
  let cont = document.createElement('div');
  let wrap = document.createElement('div');
  let header = document.createElement('h1');
  cartDisp = document.createElement('div');
  cartTotal = document.createElement('div');
  prodSelect = document.createElement('select');
  addBtn = document.createElement('button');
  stockInfo = document.createElement('div');
  cartDisp.id = 'cart-items';
  cartTotal.id = 'cart-total';
  prodSelect.id = 'product-select';
  addBtn.id = 'add-to-cart';
  stockInfo.id = 'stock-status';
  cont.className = 'bg-gray-100 p-8';
  wrap.className =
    'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8';
  header.className = 'text-2xl font-bold mb-4';
  cartTotal.className = 'text-xl font-bold my-4';
  prodSelect.className = 'border rounded p-2 mr-2';
  addBtn.className = 'bg-blue-500 text-white px-4 py-2 rounded';
  stockInfo.className = 'text-sm text-gray-500 mt-2';
  header.textContent = '장바구니';
  addBtn.textContent = '추가';
  updateSelectOptionUI();
  wrap.appendChild(header);
  wrap.appendChild(cartDisp);
  wrap.appendChild(cartTotal);
  wrap.appendChild(prodSelect);
  wrap.appendChild(addBtn);
  wrap.appendChild(stockInfo);
  cont.appendChild(wrap);
  root.appendChild(cont);
  calcCart();

  setTimeout(function () {
    setInterval(function () {
      let luckyItem = prodList[Math.floor(Math.random() * prodList.length)];
      if (Math.random() < 0.3 && luckyItem.volume > 0) {
        luckyItem.price = Math.round(luckyItem.price * 0.8);
        alert('번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!');
        updateSelectOptionUI();
      }
    }, 30000);
  }, Math.random() * 10000);

  setTimeout(function () {
    setInterval(function () {
      if (lastSel) {
        let suggest = prodList.find(function (item) {
          return item.id !== lastSel && item.volume > 0;
        });
        if (suggest) {
          alert(
            suggest.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!'
          );
          suggest.price = Math.round(suggest.price * 0.95);
          updateSelectOptionUI();
        }
      }
    }, 60000);
  }, Math.random() * 20000);
}

//updateSelectOptionUI
const updateSelectOptionUI = () => {
  prodSelect.innerHTML = '';

  prodList.forEach((product) => {
    const selectOptionTag = createSelectOption(product);
    prodSelect.appendChild(selectOptionTag);
  });
};

const createSelectOption = (product) => {
  const selectOptionTag = document.createElement('option');
  selectOptionTag.value = product.id;
  selectOptionTag.textContent = `${product.name} - ${product.price}원`;
  if (product.volume === 0) selectOptionTag.disabled = true;
  return selectOptionTag;
};
//updateSelectOptionUI

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
    const itemTotal = currentItem.price * quantity;
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
  cartTotal.textContent = `총액: ${Math.round(finalTotal)}원`;

  if (discountRate > 0) {
    const discountTag = document.createElement('span');
    discountTag.className = 'text-green-500 ml-2';
    discountTag.textContent = `(${(discountRate * 100).toFixed(1)}% 할인 적용)`;
    cartTotal.appendChild(discountTag);
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
    cartTotal.appendChild(pointTag);
  }

  pointTag.textContent = '(포인트: ' + bonusPoint + ')';
};

//updateStockInfoUI

const updateStockInfoUI = () => {
  const lowStockItems = getLowStockItems(prodList);

  const stockInfoTag = lowStockItems
    .map(
      (item) =>
        `${item.name}: ${item.volume > 0 ? `재고 부족 (${item.volume}개 남음)` : '품절'}`
    )
    .join('\n');

  stockInfo.textContent = stockInfoTag;
};

const getLowStockItems = (prodList) => {
  return prodList.filter((it) => it.volume < 5);
};
//updateStockInfoUI
main();
addBtn.addEventListener('click', function () {
  let selItem = prodSelect.value;
  let itemToAdd = prodList.find(function (p) {
    return p.id === selItem;
  });
  if (itemToAdd && itemToAdd.volume > 0) {
    let item = document.getElementById(itemToAdd.id);
    if (item) {
      let newQty =
        parseInt(item.querySelector('span').textContent.split('x ')[1]) + 1;
      if (newQty <= itemToAdd.volume) {
        item.querySelector('span').textContent =
          itemToAdd.name + ' - ' + itemToAdd.price + '원 x ' + newQty;
        itemToAdd.volume--;
      } else {
        alert('재고가 부족합니다.');
      }
    } else {
      let newItem = document.createElement('div');
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
      cartDisp.appendChild(newItem);
      itemToAdd.volume--;
    }
    calcCart();
    lastSel = selItem;
  }
});
cartDisp.addEventListener('click', function (event) {
  let tgt = event.target;
  if (
    tgt.classList.contains('quantity-change') ||
    tgt.classList.contains('remove-item')
  ) {
    let prodId = tgt.dataset.productId;
    let itemElem = document.getElementById(prodId);
    let prod = prodList.find(function (p) {
      return p.id === prodId;
    });
    if (tgt.classList.contains('quantity-change')) {
      let qtyChange = parseInt(tgt.dataset.change);
      let newQty =
        parseInt(itemElem.querySelector('span').textContent.split('x ')[1]) +
        qtyChange;
      if (
        newQty > 0 &&
        newQty <=
          prod.volume +
            parseInt(itemElem.querySelector('span').textContent.split('x ')[1])
      ) {
        itemElem.querySelector('span').textContent =
          itemElem.querySelector('span').textContent.split('x ')[0] +
          'x ' +
          newQty;
        prod.volume -= qtyChange;
      } else if (newQty <= 0) {
        itemElem.remove();
        prod.volume -= qtyChange;
      } else {
        alert('재고가 부족합니다.');
      }
    } else if (tgt.classList.contains('remove-item')) {
      let remQty = parseInt(
        itemElem.querySelector('span').textContent.split('x ')[1]
      );
      prod.volume += remQty;
      itemElem.remove();
    }
    calcCart();
  }
});
