import { productList } from "./models/userData"

var selected, addBtn, cartItems, sum, stockInfo;
var lastSel, bonusPts = 0, totalAmt = 0, itemCnt = 0;

// 상황을 보니, main 컴포넌트 자식으로 select 컴포넌트를 설계하는 과정이 있어도 되겠다
// 위 설계 과정을 가지고 basic 에서 유사 리액트를 어떻게 구현해나갈지 미리 같이 고민해놓자
// 그래야 리팩토링 파트에서 어렵지 않을 것 이다
function main() {
  // main component nodes
  var root = document.getElementById('app');
  let cont = document.createElement('div');
  var wrap = document.createElement('div');
  let hTxt = document.createElement('h1');
  cartItems = document.createElement('div');
  sum = document.createElement('div');
  selected = document.createElement('select');
  addBtn = document.createElement('button');
  stockInfo = document.createElement('div');
  
  // ids
  cartItems.id='cart-items';
  sum.id = 'cart-total';
  selected.id = 'product-select';
  addBtn.id = 'add-to-cart';
  stockInfo.id = 'stock-status';

  // classes
  cont.className = 'bg-gray-100 p-8';
  wrap.className = 'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8';
  hTxt.className = 'text-2xl font-bold mb-4';
  sum.className = 'text-xl font-bold my-4';
  selected.className = 'border rounded p-2 mr-2';
  addBtn.className = 'bg-blue-500 text-white px-4 py-2 rounded';
  stockInfo.className = 'text-sm text-gray-500 mt-2';
  
  // contents
  hTxt.textContent = '장바구니';
  addBtn.textContent = '추가';
  
  wrap.appendChild(hTxt);
  wrap.appendChild(cartItems);
  wrap.appendChild(sum);
  wrap.appendChild(selected);
  wrap.appendChild(addBtn);
  wrap.appendChild(stockInfo);
  cont.appendChild(wrap);
  root.appendChild(cont);

  cartCalculator();

  // 랜덤한 시간마다(시간이 지나면(시간마다?)) 3초동안 세일을 알림
  setTimeout(function () {
    setInterval(function () {
      var luckyItem=productList[Math.floor(Math.random() * productList.length)];
      if(Math.random() < 0.3 && luckyItem.q > 0) {
        luckyItem.val=Math.round(luckyItem.val * 0.8);
        alert('번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!');
      }
      // 다만 setTimeout 과 setInterval 을 동시에 사용하는 것은 과잉 구현에 속함
      // 하지만 논쟁의 대상으로 UX 를 조정하기 위해, 첫 랜더링 시간만 조정한 것 일수도 있다
      // setTimeout 으로 첫 이벤트 페이지만 setTimeout 으로 조정되며 그 후에는 setInterval 로 사용자에게 보여지는 것이다
    }, 30000);
    // 더 빠르게 사용자에게 노출이 되는 UX 차이가 있기 때문에 아래 로직과 중복 로직으로 제거 대상이 되지는 않음
  }, Math.random() * 10000); 

// 랜덤한 시간마다(시간이 지나면(시간마다?)) 6초동안 세일을 알린다
  setTimeout(function () {
    setInterval(function () {
      if(lastSel) {
        var suggest=productList.find(function (item) { return item.id !== lastSel && item.q > 0; });
        if(suggest) {
          alert(suggest.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!');
          suggest.val=Math.round(suggest.val * 0.95);
        }
      }
    }, 60000);
    // 위와 반대되는 사유
  }, Math.random() * 20000);

  updateSelectOptions();
};

// select 노드의 옵션을 업데이트하는 함수
function updateSelectOptions() {
  selected.innerHTML='';
  productList.forEach(function (item) {
    console.log(item)
    var opt=document.createElement('option');
    opt.value=item.id;
    opt.textContent=item.name + ' - ' + item.val + '원';
    if(item.q === 0) opt.disabled=true;
    selected.appendChild(opt);
  });
}

// 장바구니를 계산하는 함수
function cartCalculator() {
  totalAmt=0;
  itemCnt=0;
  var cartChild=cartItems.children;
  var subTot=0;
  for (var i=0; i < cartChild.length; i++) {
    (function () {
      var curItem;
      for (var j=0; j < productList.length; j++) {
        if(productList[j].id === cartChild[i].id) {
          curItem=productList[j];
          break;
        }
      }
      var q=parseInt(cartChild[i].querySelector('span').textContent.split('x ')[1]);
      var itemTot=curItem.val * q;
      var disc=0;
      itemCnt += q;
      subTot += itemTot;
      if(q >= 10) {
        if(curItem.id === 'p1') disc=0.1;
        else if(curItem.id === 'p2') disc=0.15;
        else if(curItem.id === 'p3') disc=0.2;
        else if(curItem.id === 'p4') disc=0.05;
        else if(curItem.id === 'p5') disc=0.25;
      }
      totalAmt += itemTot * (1 - disc);
    })();
  }
  let discRate=0;
  if(itemCnt >= 30) {
    var bulkDisc=totalAmt * 0.25;
    var itemDisc=subTot - totalAmt;
    if(bulkDisc > itemDisc) {
      totalAmt=subTot * (1 - 0.25);
      discRate=0.25;
    } else {
      discRate=(subTot - totalAmt) / subTot;
    }
  } else {
    discRate=(subTot - totalAmt) / subTot;
  }
  if(new Date().getDay() === 2) {
    totalAmt *= (1 - 0.1);
    discRate=Math.max(discRate, 0.1);
  }
  sum.textContent='총액: ' + Math.round(totalAmt) + '원';
  if(discRate > 0) {
    var span=document.createElement('span');
    span.className='text-green-500 ml-2';
    span.textContent='(' + (discRate * 100).toFixed(1) + '% 할인 적용)';
    sum.appendChild(span);
  }
  updateStockInfo();
  renderBonusPts();
}

// 
const renderBonusPts=() => {
  bonusPts = Math.floor(totalAmt / 1000);
  var ptsTag=document.getElementById('loyalty-points');
  if(!ptsTag) {
    ptsTag=document.createElement('span');
    ptsTag.id='loyalty-points';
    ptsTag.className='text-blue-500 ml-2';
    sum.appendChild(ptsTag);
  }
  ptsTag.textContent='(포인트: ' + bonusPts + ')';
};

// 
function updateStockInfo() {
  var infoMsg='';
  productList.forEach(function (item) {
    if(item.q < 5) {infoMsg += item.name + ': ' + (item.q > 0 ? '재고 부족 ('+item.q+'개 남음)' : '품절') + '\n';
    }
  });
  stockInfo.textContent=infoMsg;
}
main(); // 랜더링 담당자
addBtn.addEventListener('click', function () {
  var selItem=selected.value;
  var itemToAdd=productList.find(function (p) { return p.id === selItem; });
  if(itemToAdd && itemToAdd.q > 0) {
    var item=document.getElementById(itemToAdd.id);
    if(item) {
      var newQty=parseInt(item.querySelector('span').textContent.split('x ')[1]) + 1;
      if(newQty <= itemToAdd.q) {
        item.querySelector('span').textContent=itemToAdd.name + ' - ' + itemToAdd.val + '원 x ' + newQty;
        itemToAdd.q--;
      } else {alert('재고가 부족합니다.');}
    } else {
      var newItem=document.createElement('div');
      newItem.id=itemToAdd.id;
      newItem.className='flex justify-between items-center mb-2';
      newItem.innerHTML='<span>' + itemToAdd.name + ' - ' + itemToAdd.val + '원 x 1</span><div>' +
        '<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="' + itemToAdd.id + '" data-change="-1">-</button>' +
        '<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="' + itemToAdd.id + '" data-change="1">+</button>' +
        '<button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="' + itemToAdd.id + '">삭제</button></div>';
        cartItems.appendChild(newItem);
      itemToAdd.q--;
    }
    cartCalculator();
    lastSel=selItem;
  }
});
cartItems.addEventListener('click', function (event) {
  var tgt=event.target;
  if(tgt.classList.contains('quantity-change') || tgt.classList.contains('remove-item')) {
    var prodId=tgt.dataset.productId;
    var itemElem=document.getElementById(prodId);
    var prod=productList.find(function (p) { return p.id === prodId; });
    if(tgt.classList.contains('quantity-change')) {
      var qtyChange=parseInt(tgt.dataset.change);
      var newQty=parseInt(itemElem.querySelector('span').textContent.split('x ')[1]) + qtyChange;
      if(newQty > 0 && newQty <= prod.q + parseInt(itemElem.querySelector('span').textContent.split('x ')[1])) {
        itemElem.querySelector('span').textContent=itemElem.querySelector('span').textContent.split('x ')[0] + 'x ' + newQty;
        prod.q -= qtyChange;
      } else if(newQty <= 0) {
        itemElem.remove();
        prod.q -= qtyChange;
      } else {
        alert('재고가 부족합니다.');
      }
    } else if(tgt.classList.contains('remove-item')) {
      var remQty=parseInt(itemElem.querySelector('span').textContent.split('x ')[1]);
      prod.q += remQty;
      itemElem.remove();
    }
    cartCalculator();
  }
});