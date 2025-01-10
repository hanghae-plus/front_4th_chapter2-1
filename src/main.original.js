import { createCartDisp } from './components/cartDisp';
import { createAddBtn } from './components/addBtn';
import { createSum } from './components/sum';
import { createApp } from './components/app';
import { createHTxt } from './components/hTxt';
import { createSel } from './components/sel';
import { createStockInfo } from './components/stockInfo';
import { getOptionsHTML } from './utils/getOptionsHTML';
import { getBonusPts } from './utils/getBounusPts';
import { getLuckyEventInfo } from './utils/getLuckyEventInfo';
import { getSuggestionInfo } from './utils/getSuggestionInfo';

const DISCOUNT_RATE = {
  p1: 0.1,
  p2: 0.15,
  p3: 0.2,
  p4: 0.05,
  p5: 0.25,
};

function main() {
  const state = {
    lastSel: undefined,
    prodList: [
      { id: 'p1', name: '상품1', val: 10000, q: 50 },
      { id: 'p2', name: '상품2', val: 20000, q: 30 },
      { id: 'p3', name: '상품3', val: 30000, q: 20 },
      { id: 'p4', name: '상품4', val: 15000, q: 0 },
      { id: 'p5', name: '상품5', val: 25000, q: 10 },
    ],
  };
  const { calcCart } = useCalcCart(({ totalAmt, discRate, prodList }) => {
    sum.textContent = '총액: ' + Math.round(totalAmt) + '원';

    if (discRate > 0) {
      const span = document.createElement('span');
      span.className = 'text-green-500 ml-2';
      span.textContent = '(' + (discRate * 100).toFixed(1) + '% 할인 적용)';

      sum.appendChild(span);
    }

    stockInfo.textContent = prodList
      .filter((x) => x.q < 5)
      .map(
        (x) => `${x.name}: ${x.q > 0 ? `재고 부족 (${x.q}개 남음)` : '품절'}\n`,
      )
      .join('');

    if (document.getElementById('loyalty-points') == null) {
      sum.appendChild(getBonusPts({ totalAmt }));
    }
  });

  const app = createApp();
  const wrap = app.childNodes[0].childNodes[0];

  const sum = createSum();
  wrap.appendChild(sum);

  const sel = createSel();
  wrap.appendChild(sel);

  const hTxt = createHTxt();
  wrap.appendChild(hTxt);

  const stockInfo = createStockInfo({ prodList: state.prodList });
  wrap.appendChild(stockInfo);

  const cartDisp = createCartDisp({
    prodList: state.prodList,
    sum,
    stockInfo,
    calcCart,
  });
  wrap.appendChild(cartDisp);

  const addBtn = createAddBtn({
    sel,
    prodList: state.prodList,
    cartDisp,
    stockInfo,
    state,
    sum,
    calcCart,
  });
  wrap.appendChild(addBtn);

  sel.innerHTML = getOptionsHTML({ prodList: state.prodList });
  calcCart({ sum, cartDisp, prodList: state.prodList, stockInfo });

  setTimeout(() => {
    setInterval(() => {
      const luckyEvent = getLuckyEventInfo({ prodList: state.prodList });
      if (luckyEvent == null) {
        return;
      }

      sel.innerHTML = luckyEvent.optionsHTML;
      alert(luckyEvent.message);
    }, 30000);
  }, Math.random() * 10000);

  setTimeout(() => {
    setInterval(() => {
      const suggestion = getSuggestionInfo({
        state,
      });
      if (suggestion == null) {
        return;
      }

      sel.innerHTML = suggestion.optionsHTML;
      alert(suggestion.message);
    }, 60000);
  }, Math.random() * 20000);
}

function useCalcCart(callback = () => {}) {
  return {
    calcCart: ({ cartDisp, prodList, totalAmt = 0, itemCnt = 0 } = {}) => {
      let subTot = 0;

      for (const cartItem of cartDisp.children) {
        const curItem = prodList.find((x) => x.id === cartItem.id);
        const q = parseInt(
          cartItem.querySelector('span').textContent.split('x ')[1],
        );

        const itemTot = curItem.val * q;
        const disc = q >= 10 ? DISCOUNT_RATE[curItem.id] : 0;
        itemCnt += q;
        subTot += itemTot;
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
      callback({
        totalAmt,
        discRate,
        prodList,
      });
    },
  };
}

main();
