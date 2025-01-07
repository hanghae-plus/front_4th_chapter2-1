let prodList, sel, addBtn, cartDisp, sum, stockInfo;
let lastSel;

const createElement = (tag, options) => {
  const { id = '', className = '', textContent = '', ...props } = options;
  const element = document.createElement(tag);
  element.id = id;
  element.className = className;
  element.textContent = textContent;
  Object.entries(props).forEach(([key, value]) => {
    element[key] = value;
  });

  return element;
};

const getOrCreateElement = (tag, options) => {
  const { parentElement, id, ...props } = options;
  let element = document.getElementById(id);
  if (!element) {
    element = createElement(tag, { id, ...props });
    parentElement.appendChild(element);
  }
  return element;
};

const POINT_RATIO = 1000;
const getPointRatio = (totalAmt) => Math.floor(totalAmt / POINT_RATIO);
const getPointRatioMessage = (totalAmt) =>
  `(포인트: ${getPointRatio(totalAmt)})`;

const renderBonusPts = (totalAmt, parentElement) => {
  getOrCreateElement('span', {
    parentElement,
    id: 'loyalty-points',
    className: 'text-blue-500 ml-2',
    textContent: getPointRatioMessage(totalAmt),
  });
};

const LOW_STOCK = 5;
const isLowStock = (item) => item.q < LOW_STOCK;

const EMPTY_STOCK = 0;
const isOutOfStock = (item) => item.q <= EMPTY_STOCK;

const getStockStatusMessage = (item) =>
  isOutOfStock(item) ? '품절' : `재고 부족 (${item.q}개 남음)`;

const formatItemStockDisplay = (item) =>
  `${item.name}: ${getStockStatusMessage(item)}\n`;

const updateStockInfo = (prodList) =>
  prodList.filter(isLowStock).map(formatItemStockDisplay).join('');

const initInnerHTML = (element) => {
  element.innerHTML = '';
}
const getOptionsMessage = (product) => `${product.name} - ${product.val}원`;
const updateSelectedOptions = (parentElement, prodList) => {
  initInnerHTML(parentElement);
  prodList.forEach((product) => {
    getOrCreateElement('option', {
      parentElement: parentElement,
      value: product.id,
      textContent: getOptionsMessage(product),
      disabled: isOutOfStock(product),
    });
  });
}


function calcCart() {

  const cartItems = cartDisp.children;

  let totalAmt = 0;
  let itemCnt = 0;
  let subTot = 0;

  for (let i = 0; i < cartItems.length; i++) {
    (function () {
      let curItem;
      for (let j = 0; j < prodList.length; j++) {
        if (prodList[j].id === cartItems[i].id) {
          curItem = prodList[j];
          break;
        }
      }
      const q = parseInt(
        cartItems[i].querySelector('span').textContent.split('x ')[1]
      );
      const itemTot = curItem.val * q;
      let disc = 0;
      itemCnt += q;
      subTot += itemTot;
      if (q >= 10) {
        // TODO: 분기처리 수정 -> 객체를 받은 다음 Map으로 처리
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

  // TODO: 외부 주입으로 변경
  if (new Date().getDay() === 2) {
    // TODO: 할인율 매직넘버 제거
    totalAmt *= 1 - 0.1;
    discRate = Math.max(discRate, 0.1);
  }

  sum.textContent = '총액: ' + Math.round(totalAmt) + '원';

  if (discRate > 0) {
    const span = document.createElement('span');
    span.className = 'text-green-500 ml-2';
    span.textContent = '(' + (discRate * 100).toFixed(1) + '% 할인 적용)';
    sum.appendChild(span);
  }

  stockInfo.textContent = updateStockInfo(prodList);
  renderBonusPts(totalAmt, sum);
}

function main() {
  prodList = [
    { id: 'p1', name: '상품1', val: 10000, q: 50 },
    { id: 'p2', name: '상품2', val: 20000, q: 30 },
    { id: 'p3', name: '상품3', val: 30000, q: 20 },
    { id: 'p4', name: '상품4', val: 15000, q: 0 },
    { id: 'p5', name: '상품5', val: 25000, q: 10 },
  ];

  const root = document.getElementById('app');

  const container = document.createElement('div');
  container.className = 'bg-gray-100 p-8';

  const wrapper = document.createElement('div');
  wrapper.className =
    'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8';

  const title = document.createElement('h1');
  title.className = 'text-2xl font-bold mb-4';
  title.textContent = '장바구니';

  cartDisp = document.createElement('div');
  cartDisp.id = 'cart-items';

  sum = document.createElement('div');
  sum.id = 'cart-total';
  sum.className = 'text-xl font-bold my-4';

  sel = document.createElement('select');
  sel.id = 'product-select';
  sel.className = 'border rounded p-2 mr-2';

  addBtn = document.createElement('button');
  addBtn.id = 'add-to-cart';
  addBtn.className = 'bg-blue-500 text-white px-4 py-2 rounded';
  addBtn.textContent = '추가';

  stockInfo = document.createElement('div');
  stockInfo.id = 'stock-status';
  stockInfo.className = 'text-sm text-gray-500 mt-2';

  updateSelectedOptions(sel, prodList);

  wrapper.appendChild(title);
  wrapper.appendChild(cartDisp);
  wrapper.appendChild(sum);
  wrapper.appendChild(sel);
  wrapper.appendChild(addBtn);
  wrapper.appendChild(stockInfo);

  container.appendChild(wrapper);

  root.appendChild(container);

  calcCart();

  setTimeout(function () {
    setInterval(function () {
      const luckyItem = prodList[Math.floor(Math.random() * prodList.length)];
      if (Math.random() < 0.3 && luckyItem.q > 0) {
        luckyItem.val = Math.round(luckyItem.val * 0.8);
        alert('번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!');
        updateSelectedOptions(sel, prodList);
      }
    }, 30000);
  }, Math.random() * 10000);

  setTimeout(function () {
    setInterval(function () {
      if (lastSel) {
        const suggest = prodList.find(function (item) {
          return item.id !== lastSel && item.q > 0;
        });
        if (suggest) {
          alert(
            suggest.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!'
          );
          suggest.val = Math.round(suggest.val * 0.95);
          updateSelectedOptions(sel, prodList);
        }
      }
    }, 60000);
  }, Math.random() * 20000);
}

main();


addBtn.addEventListener('click', function () {
  const selItem = sel.value;
  const itemToAdd = prodList.find(function (p) {
    return p.id === selItem;
  });

  if (itemToAdd && itemToAdd.q > 0) {
    const item = document.getElementById(itemToAdd.id);

    if (item) {
      const newQty =
        parseInt(item.querySelector('span').textContent.split('x ')[1]) + 1;

      if (newQty <= itemToAdd.q) {
        item.querySelector('span').textContent =
          itemToAdd.name + ' - ' + itemToAdd.val + '원 x ' + newQty;
        itemToAdd.q--;
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
  const tgt = event.target;

  if (
    tgt.classList.contains('quantity-change') ||
    tgt.classList.contains('remove-item')
  ) {
    const prodId = tgt.dataset.productId;
    const itemElem = document.getElementById(prodId);
    const prod = prodList.find(function (p) {
      return p.id === prodId;
    });
    if (tgt.classList.contains('quantity-change')) {
      const qtyChange = parseInt(tgt.dataset.change);
      const newQty =
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
      const remQty = parseInt(
        itemElem.querySelector('span').textContent.split('x ')[1]
      );
      prod.q += remQty;
      itemElem.remove();
    }
    calcCart();
  }
});
