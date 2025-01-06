const prodList = [
  { id: 'p1', name: '상품1', val: 10000, q: 50 },
  { id: 'p2', name: '상품2', val: 20000, q: 30 },
  { id: 'p3', name: '상품3', val: 30000, q: 20 },
  { id: 'p4', name: '상품4', val: 15000, q: 0 },
  { id: 'p5', name: '상품5', val: 25000, q: 10 },
];

const Cart = () => {
  var root = document.getElementById('app');

  // 타입 에러 처리를 위한 임시 유효성
  if (!root) return;

  const render = `
      <div>
          <h1 class="text-2xl font-bold mb-4">장바구니</h1>
          <div id="cart-items"></div>
      </div>
      `;

  // INFO: 카트 계산 로직 함수
  function calcCart() {
    // 임시 변수
    var sum;

    totalAmt = 0;
    itemCnt = 0;
    var cartItems = cartDisp.children;
    var subTot = 0;
    for (var i = 0; i < cartItems.length; i++) {
      (function () {
        var curItem;

        // 타입 에러 처리를 위한 임시 유효성
        if (!curItem) return;

        for (var j = 0; j < prodList.length; j++) {
          if (prodList[j].id === cartItems[i].id) {
            curItem = prodList[j];
            break;
          }
        }
        var q = parseInt(cartItems[i].querySelector('span').textContent.split('x ')[1]);
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
    sum.textContent = '총액: ' + Math.round(totalAmt) + '원';
    if (discRate > 0) {
      var span = document.createElement('span');
      span.className = 'text-green-500 ml-2';
      span.textContent = '(' + (discRate * 100).toFixed(1) + '% 할인 적용)';
      sum.appendChild(span);
    }
    updateStockInfo();
    renderBonusPts();
  }

  // INFO: 카트 제거 버튼
  root.addEventListener('click', function (event) {
    // cart-items로 클릭인지 처리

    var tgt = event.target;

    // 타입 에러 처리를 위한 임시 유효성
    if (!tgt) return;

    if (tgt.classList.contains('quantity-change') || tgt.classList.contains('remove-item')) {
      var prodId = tgt.dataset.productId;
      var itemElem = document.getElementById(prodId);

      // 타입 에러 처리를 위한 임시 유효성
      if (!itemElem) return;

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

  // INFO: "추가" 버튼 클릭 핸들러
  root.addEventListener('click', function () {
    // addBtn 클릭인지 확인해야함

    var selItem = sel.value;

    var itemToAdd = prodList.find(function (p) {
      return p.id === selItem;
    });

    if (itemToAdd && itemToAdd.q > 0) {
      var item = document.getElementById(itemToAdd.id);

      // 타입 에러 처리를 위한 임시 유효성
      if (!item) return;

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
};
