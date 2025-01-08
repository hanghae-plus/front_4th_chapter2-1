let lastSel, // 장바구니에서 마지막으로 선택한 상품 ID
  bonusPts = 0, // 포인트
  totalAmt = 0, // 총액
  itemCnt = 0; //상품 수량을 저장하는 변수

// 상품 데이터 (상품 ID, 이름, 가격 재고)
const productList = [
  { id: 'p1', name: '상품1', price: 10000, quantity: 50 },
  { id: 'p2', name: '상품2', price: 20000, quantity: 30 },
  { id: 'p3', name: '상품3', price: 30000, quantity: 20 },
  { id: 'p4', name: '상품4', price: 15000, quantity: 0 },
  { id: 'p5', name: '상품5', price: 25000, quantity: 10 },
];

// DOM 요소 초기화
const root = document.getElementById('app');
const cont = document.createElement('div');
const wrap = document.createElement('div');
const hTxt = document.createElement('h1');
const cartDisplay = document.createElement('div');
const totalDisplay = document.createElement('div');
const productSelect = document.createElement('select');
const addBtn = document.createElement('button');
const stockStatusDisplay = document.createElement('div');

function main() {
  // UI 요소 ID 및 클래스 설정
  cartDisplay.id = 'cart-items';
  totalDisplay.id = 'cart-total';
  productSelect.id = 'product-select';
  addBtn.id = 'add-to-cart';
  stockStatusDisplay.id = 'stock-status';
  cont.className = 'bg-gray-100 p-8';
  wrap.className =
    'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8';
  hTxt.className = 'text-2xl font-bold mb-4';
  totalDisplay.className = 'text-xl font-bold my-4';
  productSelect.className = 'border rounded p-2 mr-2';
  addBtn.className = 'bg-blue-500 text-white px-4 py-2 rounded';
  stockStatusDisplay.className = 'text-sm text-gray-500 mt-2';

  // UI 텍스트 설정
  hTxt.textContent = '장바구니';
  addBtn.textContent = '추가';

  // 상품 옵션을 드랍다운에 추가
  updateSelOpts();

  // UI 구조 생성
  wrap.appendChild(hTxt);
  wrap.appendChild(cartDisplay);
  wrap.appendChild(totalDisplay);
  wrap.appendChild(productSelect);
  wrap.appendChild(addBtn);
  wrap.appendChild(stockStatusDisplay);
  cont.appendChild(wrap);
  root.appendChild(cont);

  // 장바구니 초기 상태 계산
  calcCart();

  // 번개 세일 이벤트 : 30초 간격으로 상품 랜덤 할인
  setTimeout(function () {
    setInterval(function () {
      let luckyItem = productList[Math.floor(Math.random() * productList.length)];
      if (Math.random() < 0.3 && luckyItem.quantity > 0) {
        luckyItem.price = Math.round(luckyItem.price * 0.8);
        alert('번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!');
        updateSelOpts();
      }
    }, 30000);
  }, Math.random() * 10000);

  // 상품 추천 이벤트 : 60초 간격으로 추천 상품 제안
  setTimeout(function () {
    setInterval(function () {
      if (lastSel) {
        let suggest = productList.find(function (item) {
          return item.id !== lastSel && item.q > 0;
        });
        if (suggest) {
          alert(suggest.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!');
          suggest.price = Math.round(suggest.price * 0.95);
          updateSelOpts();
        }
      }
    }, 60000);
  }, Math.random() * 20000);
}

// 상품 목록을 드롭다운에 추가
function updateSelOpts() {
  productSelect.innerHTML = ''; // 기존 옵션 제거
  productList.forEach(function (item) {
    let opt = document.createElement('option');
    opt.value = item.id; // 상품 ID
    opt.textContent = item.name + ' - ' + item.price + '원';
    if (item.quantity === 0) opt.disabled = true; // 재고 없는 상품 비활성화
    productSelect.appendChild(opt);
  });
}

// 장바구니 상태 계산 및 UI 업데이트
function calcCart() {
  totalAmt = 0;
  itemCnt = 0;
  let cartItems = cartDisplay.children;
  let subTot = 0;
  for (let i = 0; i < cartItems.length; i++) {
    (function () {
      let curItem;
      for (let j = 0; j < productList.length; j++) {
        if (productList[j].id === cartItems[i].id) {
          curItem = productList[j];
          break;
        }
      }

      let q = parseInt(cartItems[i].querySelector('span').textContent.split('x ')[1]);

      let itemTot = curItem.price * q;
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
    let bulkDisc = totalAmt * 0.25;
    let itemDisc = subTot - totalAmt;
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

  totalDisplay.textContent = '총액: ' + Math.round(totalAmt) + '원';

  if (discRate > 0) {
    let span = document.createElement('span');
    span.className = 'text-green-500 ml-2';
    span.textContent = '(' + (discRate * 100).toFixed(1) + '% 할인 적용)';
    totalDisplay.appendChild(span);
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
    totalDisplay.appendChild(ptsTag);
  }
  ptsTag.textContent = '(포인트: ' + bonusPts + ')';
};

function updateStockInfo() {
  let infoMsg = '';
  productList.forEach(function (item) {
    if (item.quantity < 5) {
      infoMsg +=
        item.name +
        ': ' +
        (item.quantity > 0 ? '재고 부족 (' + item.quantity + '개 남음)' : '품절') +
        '\n';
    }
  });
  stockStatusDisplay.textContent = infoMsg;
}

main();

addBtn.addEventListener('click', function () {
  let selItem = productSelect.value;
  let itemToAdd = productList.find(function (p) {
    return p.id === selItem;
  });

  if (itemToAdd && itemToAdd.quantity > 0) {
    let item = document.getElementById(itemToAdd.id);
    if (item) {
      let newQty = parseInt(item.querySelector('span').textContent.split('x ')[1]) + 1;
      if (newQty <= itemToAdd.quantity) {
        item.querySelector('span').textContent =
          itemToAdd.name + ' - ' + itemToAdd.price + '원 x ' + newQty;
        itemToAdd.quantity--;
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
      cartDisplay.appendChild(newItem);
      itemToAdd.quantity--;
    }

    calcCart();
    lastSel = selItem;
  }
});

cartDisplay.addEventListener('click', function (event) {
  let tgt = event.target;
  if (tgt.classList.contains('quantity-change') || tgt.classList.contains('remove-item')) {
    let prodId = tgt.dataset.productId;
    let itemElem = document.getElementById(prodId);
    let prod = productList.find(function (p) {
      return p.id === prodId;
    });
    if (tgt.classList.contains('quantity-change')) {
      let qtyChange = parseInt(tgt.dataset.change);
      let newQty = parseInt(itemElem.querySelector('span').textContent.split('x ')[1]) + qtyChange;
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
      let remQty = parseInt(itemElem.querySelector('span').textContent.split('x ')[1]);
      prod.quantity += remQty;
      itemElem.remove();
    }
    calcCart();
  }
});
