import { html } from '../libs/index.js';

// 선택가능한 옵션들을 화면에 표시
export const updateSelectableOptionsDisplay = ({ selectedPropComponent, items }) => {
  selectedPropComponent.update({ children: [''] });

  items.forEach(item => {
    const optComponent = html`<option value=${item.id} disabled=${item.qty === 0}>${item.name} - ${item.val}원</option>`;

    selectedPropComponent.update({ children: [...selectedPropComponent.children, optComponent] });
  });
};

// 총액과 할인율을 화면에 표시
export const updateTotalAmountDisplay = ({ totalAmountComponent, amount, discountRate, withPoints = false }) => {
  // 기존 로직 + 할인율 표시 준비
  let baseText = `총액: ${Math.round(amount)}원`;

  if (withPoints) {
    // 포인트 계산
    const bonusPoints = Math.floor(amount / 1000);
    // 기존 text에 "(포인트: ???)" 추가
    baseText += `(포인트: ${bonusPoints})`;
  }

  // 우선 text만 업데이트
  totalAmountComponent.update({ children: [baseText] });

  // 할인율 표시
  if (discountRate > 0) {
    const discountSpan = html`<span class="text-green-500 ml-2">(${(discountRate * 100).toFixed(1)}% 할인 적용)</span>`;
    totalAmountComponent.update({
      children: [...totalAmountComponent.get('children'), discountSpan],
    });
  }
};

// 재고 부족시 정보 표시
export const updateStockInfoDisplay = ({ StockInfoComponent, prodList }) => {
  let infoMessage = '';
  prodList.forEach(product => {
    if (product.qty < 5) {
      infoMessage += product.name + ': ' + (product.qty > 0 ? '재고 부족 (' + product.qty + '개 남음)' : '품절') + '\n';
    }
  });
  StockInfoComponent.update({ children: [infoMessage] });
};

// 보너스 포인트 표시
export function updateBonusPointsDisplay({ totalAmount }) {
  // 이미 DOM에 존재하는지 확인
  let ptsEl = document.getElementById('loyalty-points');
  if (!ptsEl) {
    // 아직 없으면 새로 만들고, cart-total(혹은 원하는 부모)에 붙임
    ptsEl = document.createElement('span');
    ptsEl.id = 'loyalty-points';
    ptsEl.className = 'text-blue-500 ml-2';

    // cart-total 요소를 찾아 자식으로 붙임
    const cartTotalElem = document.getElementById('cart-total');
    cartTotalElem.appendChild(ptsEl);
  }

  // 포인트 계산
  const pts = Math.floor(totalAmount / 1000);

  // 텍스트 갱신
  ptsEl.textContent = `(포인트: ${pts})`;
}
