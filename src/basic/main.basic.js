/**
 * 1. 가독성.
 *  - 게슈탈트 원칙.
 *  - 위에서 아래로 읽기.
 *  - 적절한 공백
 *  - 프리티어
 * 2. 좋은 구조
 *  - 데이터 관점 보다는 역할 관점으로 묶기.
 * 3. 좋은 이름 짓기
 *  - push(), add(), insert(), new(), create(), append(), spawn()
 *  - get(), fetch(), from(), of()
 *  - current, selected
 *  - key, index
 *  - is, has
 */

const renderLoyaltyPointsElement = (loyaltyPoint) => {
  let $loyaltyPoints = document.getElementById('loyalty-points');
  if (!$loyaltyPoints) {
    $loyaltyPoints = document.createElement('span');
    $loyaltyPoints.id = 'loyalty-points';
    $loyaltyPoints.className = 'text-blue-500 ml-2';
    $sum.appendChild($loyaltyPoints);
  }
  $loyaltyPoints.textContent = '(포인트: ' + loyaltyPoint + ')';
};

function updateStockStatusElement() {
  const $stockStatus = document.getElementById('stock-status');
  let infoMsg = '';
  PRODUCT_LIST.forEach(function (item) {
    if (item.q < 5) {
      infoMsg +=
        item.name +
        ': ' +
        (item.q > 0 ? '재고 부족 (' + item.q + '개 남음)' : '품절') +
        '\n';
    }
  });
  $stockStatus.textContent = infoMsg;
}

function calcCart(cartItems) {
  let totalAmount = 0;
  let itemCnt = 0;
  let subTot = 0;
  for (let i = 0; i < cartItems.length; i++) {
    let curItem;
    for (let j = 0; j < PRODUCT_LIST.length; j++) {
      if (PRODUCT_LIST[j].id === cartItems[i].id) {
        curItem = PRODUCT_LIST[j];
        break;
      }
    }
    let q = parseInt(
      cartItems[i].querySelector('span').textContent.split('x ')[1]
    );
    let itemTot = curItem.val * q;
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
    totalAmount += itemTot * (1 - disc);
  }
  let discRate = 0;
  if (itemCnt >= 30) {
    let bulkDisc = totalAmount * 0.25;
    let itemDisc = subTot - totalAmount;
    if (bulkDisc > itemDisc) {
      totalAmount = subTot * (1 - 0.25);
      discRate = 0.25;
    } else {
      discRate = (subTot - totalAmount) / subTot;
    }
  } else {
    discRate = (subTot - totalAmount) / subTot;
  }
  if (new Date().getDay() === 2) {
    totalAmount *= 1 - 0.1;
    discRate = Math.max(discRate, 0.1);
  }
  $sum.textContent = '총액: ' + Math.round(totalAmount) + '원';
  if (discRate > 0) {
    let span = document.createElement('span');
    span.className = 'text-green-500 ml-2';
    span.textContent = '(' + (discRate * 100).toFixed(1) + '% 할인 적용)';
    $sum.appendChild(span);
  }

  let loyaltyPoint = totalAmount > 0 ? Math.floor(totalAmount / 1000) : 0;
  renderLoyaltyPointsElement(loyaltyPoint);
}

function renderSelOpts() {
  $sel.innerHTML = '';
  PRODUCT_LIST.forEach(function (item) {
    let opt = document.createElement('option');
    opt.value = item.id;
    opt.textContent = item.name + ' - ' + item.val + '원';
    if (item.q === 0) opt.disabled = true;
    $sel.appendChild(opt);
  });
}

const PRODUCT_LIST = [
  { id: 'p1', name: '상품1', val: 10000, q: 50 },
  { id: 'p2', name: '상품2', val: 20000, q: 30 },
  { id: 'p3', name: '상품3', val: 30000, q: 20 },
  { id: 'p4', name: '상품4', val: 15000, q: 0 },
  { id: 'p5', name: '상품5', val: 25000, q: 10 },
];
let $sum;
let $stockStatus;
let $sel;
export default function main() {
  let lastSel;

  let $hTxt = document.createElement('h1');
  $hTxt.className = 'text-2xl font-bold mb-4';
  $hTxt.textContent = '장바구니';

  let $cartDisp = document.createElement('div');
  $cartDisp.id = 'cart-items';
  $cartDisp.addEventListener('click', function (event) {
    let tgt = event.target;
    if (
      tgt.classList.contains('quantity-change') ||
      tgt.classList.contains('remove-item')
    ) {
      let prodId = tgt.dataset.productId;
      let itemElem = document.getElementById(prodId);
      let prod = PRODUCT_LIST.find(function (p) {
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
        let remQty = parseInt(
          itemElem.querySelector('span').textContent.split('x ')[1]
        );
        prod.q += remQty;
        itemElem.remove();
      }
      calcCart($cartDisp.children);
      updateStockStatusElement();
    }
  });

  $sum = document.createElement('div');
  $sum.id = 'cart-total';
  $sum.className = 'text-xl font-bold my-4';

  $sel = document.createElement('select');
  $sel.id = 'product-select';
  $sel.className = 'border rounded p-2 mr-2';
  renderSelOpts();

  let $addBtn = document.createElement('button');
  $addBtn.id = 'add-to-cart';
  $addBtn.className = 'bg-blue-500 text-white px-4 py-2 rounded';
  $addBtn.textContent = '추가';
  $addBtn.addEventListener('click', function () {
    let selItem = $sel.value;
    let itemToAdd = PRODUCT_LIST.find(function (p) {
      return p.id === selItem;
    });
    if (itemToAdd && itemToAdd.q > 0) {
      let item = document.getElementById(itemToAdd.id);
      if (item) {
        let newQty =
          parseInt(item.querySelector('span').textContent.split('x ')[1]) + 1;
        if (newQty <= itemToAdd.q) {
          item.querySelector('span').textContent =
            itemToAdd.name + ' - ' + itemToAdd.val + '원 x ' + newQty;
          itemToAdd.q--;
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
        $cartDisp.appendChild(newItem);
        itemToAdd.q--;
      }
      calcCart($cartDisp.children);
      updateStockStatusElement();
      lastSel = selItem;
    }
  });

  $stockStatus = document.createElement('div');
  $stockStatus.id = 'stock-status';
  $stockStatus.className = 'text-sm text-gray-500 mt-2';

  let $wrap = document.createElement('div');
  $wrap.className =
    'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8';
  $wrap.appendChild($hTxt);
  $wrap.appendChild($cartDisp);
  $wrap.appendChild($sum);
  $wrap.appendChild($sel);
  $wrap.appendChild($addBtn);
  $wrap.appendChild($stockStatus);

  let $cont = document.createElement('div');
  $cont.className = 'bg-gray-100 p-8';
  $cont.appendChild($wrap);

  let $root = document.getElementById('app');
  $root.appendChild($cont);

  calcCart($cartDisp.children);
  updateStockStatusElement();
  setTimeout(function () {
    setInterval(function () {
      let luckyItem =
        PRODUCT_LIST[Math.floor(Math.random() * PRODUCT_LIST.length)];
      if (Math.random() < 0.3 && luckyItem.q > 0) {
        luckyItem.val = Math.round(luckyItem.val * 0.8);
        alert('번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!');
        renderSelOpts();
      }
    }, 30000);
  }, Math.random() * 10000);

  setTimeout(function () {
    setInterval(function () {
      if (lastSel) {
        let suggest = PRODUCT_LIST.find(function (item) {
          return item.id !== lastSel && item.q > 0;
        });
        if (suggest) {
          alert(
            suggest.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!'
          );
          suggest.val = Math.round(suggest.val * 0.95);
          renderSelOpts();
        }
      }
    }, 60000);
  }, Math.random() * 20000);
}

main();
