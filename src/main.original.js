import { createCartDisp } from './components/cartDisp';
import { createAddBtn } from './components/addBtn';
import { createSum } from './components/sum';
import { createApp } from './components/app';
import { createHTxt } from './components/hTxt';
import { createSel } from './components/sel';
import { createStockInfo } from './components/stockInfo';

function main() {
  const state = { lastSel: undefined };
  const prodList = [
    { id: 'p1', name: '상품1', val: 10000, q: 50 },
    { id: 'p2', name: '상품2', val: 20000, q: 30 },
    { id: 'p3', name: '상품3', val: 30000, q: 20 },
    { id: 'p4', name: '상품4', val: 15000, q: 0 },
    { id: 'p5', name: '상품5', val: 25000, q: 10 },
  ];

  const app = createApp();
  const wrap = app.childNodes[0].childNodes[0];

  const sum = createSum();
  wrap.appendChild(sum);

  const sel = createSel();
  wrap.appendChild(sel);

  const hTxt = createHTxt();
  wrap.appendChild(hTxt);

  const stockInfo = createStockInfo();
  wrap.appendChild(stockInfo);

  const cartDisp = createCartDisp({ prodList, sum, stockInfo, calcCart });
  wrap.appendChild(cartDisp);

  const addBtn = createAddBtn({
    sel,
    prodList,
    cartDisp,
    stockInfo,
    state,
    sum,
    calcCart,
  });
  wrap.appendChild(addBtn);

  updateSelOpts({ sel, prodList });
  calcCart({ sum, cartDisp, prodList, stockInfo });

  setTimeout(() => {
    setInterval(() => {
      executeThunderSale({ sel, prodList });
    }, 30000);
  }, Math.random() * 10000);

  setTimeout(() => {
    setInterval(() => {
      executeSuggestion({ sel, prodList, state });
    }, 60000);
  }, Math.random() * 20000);
}

function executeThunderSale({ sel, prodList }) {
  const luckyItem = prodList[Math.floor(Math.random() * prodList.length)];

  if (Math.random() < 0.3 && luckyItem.q > 0) {
    luckyItem.val = Math.round(luckyItem.val * 0.8);
    alert('번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!');
    updateSelOpts({ sel, prodList });
  }
}

function executeSuggestion({ sel, prodList, state }) {
  if (state.lastSel == null) {
    return;
  }

  const suggest = prodList.find(function (item) {
    return item.id != state.lastSel && item.q > 0;
  });

  if (suggest == null) {
    return;
  }

  alert(suggest.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!');
  suggest.val = Math.round(suggest.val * 0.95);
  updateSelOpts({ sel, prodList });
}

function updateSelOpts({ sel, prodList }) {
  sel.innerHTML = '';

  prodList.forEach((item) => {
    const opt = document.createElement('option');
    opt.value = item.id;
    opt.textContent = item.name + ' - ' + item.val + '원';
    if (item.q === 0) opt.disabled = true;
    sel.appendChild(opt);
  });
}

function calcCart({
  sum,
  cartDisp,
  prodList,
  totalAmt = 0,
  itemCnt = 0,
  stockInfo,
} = {}) {
  const cartItems = cartDisp.children;
  let subTot = 0;

  for (let i = 0; i < cartItems.length; i++) {
    let curItem;
    for (let j = 0; j < prodList.length; j++) {
      if (prodList[j].id === cartItems[i].id) {
        curItem = prodList[j];
        break;
      }
    }
    const q = parseInt(
      cartItems[i].querySelector('span').textContent.split('x ')[1],
    );
    const itemTot = curItem.val * q;
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

  if (new Date().getDay() === 2) {
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

  updateStockInfo({ prodList, stockInfo });
  renderBonusPts({ sum, totalAmt });
}

const renderBonusPts = ({ sum, totalAmt }) => {
  const bonusPts = Math.floor(totalAmt / 1000);

  let ptsTag = document.getElementById('loyalty-points');
  if (ptsTag != null) {
    return;
  }

  ptsTag = document.createElement('span');
  ptsTag.id = 'loyalty-points';
  ptsTag.className = 'text-blue-500 ml-2';
  sum.appendChild(ptsTag);
  ptsTag.textContent = '(포인트: ' + bonusPts + ')';
};

function updateStockInfo({ prodList = [], stockInfo }) {
  let infoMsg = '';

  prodList.forEach((item) => {
    if (item.q < 5) {
      infoMsg +=
        item.name +
        ': ' +
        (item.q > 0 ? '재고 부족 (' + item.q + '개 남음)' : '품절') +
        '\n';
    }
  });

  stockInfo.textContent = infoMsg;

  return { prodList, stockInfo };
}

main();
