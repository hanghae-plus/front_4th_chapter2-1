let itemDropbox_Elmt, addBtn_Elmt, cartItem_Elmt, totalPrice_Elmt, stock_Elmt;
let lastAddedItem, // 장바구니에 가장 최근 담은 제품
  bonusPoint = 0,
  totalPrice = 0,
  cartTotalCnt = 0;

let saleItemIdx = { p1: 0, p2: 1, p3: 2, p4: 3, p5: 4 };
let saleItemList = [
  { id: 'p1', name: '상품1', price: 10000, qty: 50 },
  { id: 'p2', name: '상품2', price: 20000, qty: 30 },
  { id: 'p3', name: '상품3', price: 30000, qty: 20 },
  { id: 'p4', name: '상품4', price: 15000, qty: 0 },
  { id: 'p5', name: '상품5', price: 25000, qty: 10 },
];

function main() {
  let cont = document.createElement('div');
  cont.className = 'bg-gray-100 p-8';

  let wrap = document.createElement('div');
  wrap.className = 'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8';

  let hTxt = document.createElement('h1');
  hTxt.className = 'text-2xl font-bold mb-4';
  hTxt.textContent = '장바구니';

  cartItem_Elmt = document.createElement('div');
  cartItem_Elmt.id = 'cart-items';

  totalPrice_Elmt = document.createElement('div');
  totalPrice_Elmt.id = 'cart-total';
  totalPrice_Elmt.className = 'text-xl font-bold my-4';

  itemDropbox_Elmt = document.createElement('select');
  itemDropbox_Elmt.id = 'product-select';
  itemDropbox_Elmt.className = 'border rounded p-2 mr-2';

  addBtn_Elmt = document.createElement('button');
  addBtn_Elmt.id = 'add-to-cart';
  addBtn_Elmt.className = 'bg-blue-500 text-white px-4 py-2 rounded';
  addBtn_Elmt.textContent = '추가';

  stock_Elmt = document.createElement('div');
  stock_Elmt.id = 'stock-status';
  stock_Elmt.className = 'text-sm text-gray-500 mt-2';

  setSaleItemDropbox();
  wrap.appendChild(hTxt);
  wrap.appendChild(cartItem_Elmt);
  wrap.appendChild(totalPrice_Elmt);
  wrap.appendChild(itemDropbox_Elmt);
  wrap.appendChild(addBtn_Elmt);
  wrap.appendChild(stock_Elmt);
  cont.appendChild(wrap);
  document.getElementById('app').appendChild(cont);

  calcTotalPrice();

  // 번개세일 팝업
  setTimeout(function () {
    setInterval(function () {
      let luckyItem = saleItemList[Math.floor(Math.random() * saleItemList.length)];

      if (Math.random() < 0.3 && luckyItem.qty > 0) {
        let 할인20 = 0.8;
        luckyItem.price = Math.round(luckyItem.price * 할인20);
        alert('번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!');
        setSaleItemDropbox();
      }
    }, 30_000); //30s
  }, Math.random() * 10000);

  // 구매 제안 팝업
  setTimeout(function () {
    setInterval(function () {
      if (!lastAddedItem) return;

      //추천상품 : 최근 구매한거 아니고, 양 0보다 많은거
      let suggest = saleItemList.find(function (item) {
        return item.id !== lastAddedItem && item.qty > 0;
      });

      if (suggest) {
        alert(suggest.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!');
        let 할인5 = 0.95;
        suggest.price = Math.round(suggest.price * 할인5);
        setSaleItemDropbox();
      }
    }, 60000); // 1분
  }, Math.random() * 20000);
}
main();
// 상품 선택 드롭박스 innerHTML 생성
function setSaleItemDropbox() {
  itemDropbox_Elmt.innerHTML = '';
  let innerHtmlString = '';
  saleItemList.forEach(function (item) {
    innerHtmlString +=
      `
      <option value="${item.id}"${item.qty === 0 ? ' disabled' : ''}>` +
      item.name +
      ' - ' +
      item.price +
      '원' +
      `</option>`;
  });
  itemDropbox_Elmt.innerHTML = innerHtmlString;
}

// 장바구니 총금액 계산
function calcTotalPrice() {
  cartTotalCnt = 0; // 장바구니 총 수량?
  totalPrice = 0;
  let cartItemList_Elmt = cartItem_Elmt.children;
  let 할인전가격 = 0;

  //상품별 할인율 계산
  for (const cartItem_Elmt of cartItemList_Elmt) {
    let checkingItem = saleItemList[saleItemIdx[cartItem_Elmt.id]];
    let checkingItemQuantity = parseInt(cartItem_Elmt.querySelector('span').textContent.split('x ')[1]);

    let totalPricePerItem = checkingItem.price * checkingItemQuantity;
    cartTotalCnt += checkingItemQuantity;
    할인전가격 += totalPricePerItem;

    let 상품별할인율 = 0;
    if (checkingItemQuantity >= 10) {
      switch (checkingItem.id) {
        case 'p1':
          상품별할인율 = 0.1;
          break;
        case 'p2':
          상품별할인율 = 0.15;
          break;
        case 'p3':
          상품별할인율 = 0.2;
          break;
        case 'p4':
          상품별할인율 = 0.05;
          break;
        case 'p5':
          상품별할인율 = 0.25;
          break;
      }
    }
    totalPrice += totalPricePerItem * (1 - 상품별할인율);
  }

  let 장바구니할인율 = 0;
  if (cartTotalCnt >= 30) {
    let 벌크할인가 = totalPrice * 0.25;
    let itemDisc = 할인전가격 - totalPrice;

    if (벌크할인가 > itemDisc) {
      totalPrice = 할인전가격 * (1 - 0.25);
      장바구니할인율 = 0.25;
    } else {
      장바구니할인율 = (할인전가격 - totalPrice) / 할인전가격;
    }
  } else {
    장바구니할인율 = (할인전가격 - totalPrice) / 할인전가격;
  }

  //화요일 세일
  if (new Date().getDay() === 2) {
    totalPrice *= 0.9;
    장바구니할인율 = Math.max(장바구니할인율, 0.1);
  }

  //렌더링
  let sumInnerHtml = '총액: ' + Math.round(totalPrice) + '원';
  if (장바구니할인율 > 0) {
    sumInnerHtml += `<span class="text-green-500 ml-2">(${(장바구니할인율 * 100).toFixed(
      1
    )}% 할인 적용)</span>`;
  }
  totalPrice_Elmt.textContent = sumInnerHtml;
  updateStockInfo();
  renderbonusPoint();
}

// 보너스 포인트 계산 + 렌더
function renderbonusPoint() {
  bonusPoint = Math.floor(totalPrice / 1000);
  let point_Elmt = document.getElementById('loyalty-points');
  if (!point_Elmt) {
    totalPrice_Elmt.innerHTML += `<span id="loyalty-points" class="text-blue-500 ml-2"></span>`;
    point_Elmt = document.getElementById('loyalty-points');
  }
  point_Elmt.textContent = `(포인트: ${bonusPoint})`;
}

// 부족 재고 및 품절상품 안내
function updateStockInfo() {
  let itemStatus = '';

  saleItemList.forEach(function (item) {
    if (item.qty === 0) {
      itemStatus += `${item.name}: 품절\n`;
    } else if (item.qty < 5) {
      itemStatus += `${item.name}: 재고 부족 (${item.qty}개 남음)\n`;
    }
  });

  stock_Elmt.textContent = itemStatus;
}

//상품 장바구니에 추가버튼
addBtn_Elmt.addEventListener('click', function () {
  let selItem = itemDropbox_Elmt.value;
  let itemToAdd = saleItemList[saleItemIdx[selItem]];
  if (itemToAdd.qty === 0) {
    //#001
    alert('재고가 부족합니다.');
  }

  if (!itemToAdd || itemToAdd.qty === 0) return; // 종료조건

  let itemAdded = document.getElementById(itemToAdd.id);
  if (itemAdded) {
    let newQty = parseInt(itemAdded.querySelector('span').textContent.split('x ')[1]) + 1;

    itemAdded.querySelector('span').textContent = `${itemToAdd.name} - ${itemToAdd.price}원 x ${newQty}`;
    itemToAdd.qty--;
  } else {
    addItemHtmlToCart(itemToAdd);

    itemToAdd.qty--;
  }
  calcTotalPrice();
  lastAddedItem = selItem;
});

// item정보를 받아 html요소를 생성 후 cart div에 추가
function addItemHtmlToCart(item) {
  let newItem = document.createElement('div');
  newItem.id = item.id;
  newItem.className = 'flex justify-between items-center mb-2';
  newItem.innerHTML =
    `<span>${item.name} - ${item.price}원 x 1</span>` +
    ` <div>
        <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
          data-product-id="${item.id}" data-change="-1">-
        </button>
        <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
          data-product-id="${item.id}" data-change="1">+
        </button>
        <button class="remove-item bg-red-500 text-white px-2 py-1 rounded"
          data-product-id="${item.id}">삭제</button>
      </div>`;
  cartItem_Elmt.appendChild(newItem);
}

cartItem_Elmt.addEventListener('click', function (event) {
  let tgt = event.target;

  if (tgt.classList.contains('quantity-change') || tgt.classList.contains('remove-item')) {
    let itemId = tgt.dataset.productId;
    let itemElem = document.getElementById(itemId);
    let prod = saleItemList.find(function (p) {
      return p.id === itemId;
    });

    if (tgt.classList.contains('quantity-change')) {
      let qtyChange = parseInt(tgt.dataset.change);
      let newQty = parseInt(itemElem.querySelector('span').textContent.split('x ')[1]) + qtyChange;

      if (
        newQty > 0 &&
        newQty <= prod.qty + parseInt(itemElem.querySelector('span').textContent.split('x ')[1])
      ) {
        itemElem.querySelector('span').textContent =
          itemElem.querySelector('span').textContent.split('x ')[0] + 'x ' + newQty;
        prod.qty -= qtyChange;
      } else if (newQty <= 0) {
        itemElem.remove();
        prod.qty -= qtyChange;
      } else {
        alert('재고가 부족합니다.');
      }
    } else if (tgt.classList.contains('remove-item')) {
      let remQty = parseInt(itemElem.querySelector('span').textContent.split('x ')[1]);
      prod.qty += remQty;
      itemElem.remove();
    }
    calcTotalPrice();
  }
});
