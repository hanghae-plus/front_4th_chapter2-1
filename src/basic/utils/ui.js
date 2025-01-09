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
export const updateTotalAmountDisplay = ({ totalAmountComponent, amount, discountRate }) => {
  totalAmountComponent.update({ children: `총액: ${Math.round(amount)}원` });

  if (discountRate > 0) {
    const discountSpan = html`<span class="text-green-500 ml-2">(${(discountRate * 100).toFixed(1)}% 할인 적용)</span>`;

    totalAmountComponent.update({ children: [...totalAmountComponent.children, discountSpan] });
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
export const updateBonusPointsDisplay = ({ totalAmountComponent, totalAmount }) => {
  const bonusPoints = Math.floor(totalAmount / 1000);

  const loyaltyPointsComponent = totalAmountComponent.get('children').find(child => child.id === 'loyalty-points');

  if (!loyaltyPointsComponent) {
    loyaltyPointsComponent = html`<span id="loyalty-points" class="text-blue-500 ml-2"></span>`;
    totalAmountComponent.update({ children: [...totalAmountComponent.children, loyaltyPointsComponent] });
  }

  loyaltyPointsComponent.update({ children: [`(포인트: ${bonusPoints})`] });
};
