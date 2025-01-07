import { CartItem } from './cart-item/CartItem';
import { CartStore } from '../../store/cartStore';
import { addEventListener } from '../../utils/eventUtil';

export const Cart = () => {
  const { actions } = CartStore;

  const cartList = actions.getCartList();

  return `
      <div>
          <h1 class="text-2xl font-bold mb-4">장바구니</h1>
          <div id="cart-items">
          ${cartList?.map((item) => CartItem(item))}
          </div>
      </div>
      `;

  // INFO: 카트 계산 로직 함수
  function calcCart() {
    // 임시 변수
    let sum;

    totalAmt = 0;
    itemCnt = 0;
    const cartItems = cartDisp.children;
    let subTot = 0;
    for (var i = 0; i < cartItems.length; i++) {
      (function () {
        let curItem;

        // 타입 에러 처리를 위한 임시 유효성
        if (!curItem) return;

        for (let j = 0; j < prodList.length; j++) {
          if (prodList[j].id === cartItems[i].id) {
            curItem = prodList[j];
            break;
          }
        }
        const q = parseInt(cartItems[i].querySelector('span').textContent.split('x ')[1]);
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
    updateStockInfo();
    renderBonusPts();
  }
};
