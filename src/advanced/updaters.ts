import { CURRENCY, ID_BY_COMPONENT } from './const';

export const updateDiscInfo = (price, rate) => {
  const sum = document.querySelector(`#${ID_BY_COMPONENT.SUM_ID}`);
  sum.textContent = `총액: ${Math.round(price)}${CURRENCY}`;

  if (rate > 0) {
    const span = document.createElement('span');
    span.className = 'text-green-500 ml-2';
    span.textContent = `(${(rate * 100).toFixed(1)}% 할인 적용)`;
    sum.appendChild(span);
  }
};

export const updateBonusPts = (price) => {
  const sum = document.querySelector(`#${ID_BY_COMPONENT.SUM_ID}`);
  const bonusPts = Math.floor(price / 1000);

  let ptsTag = document.getElementById(ID_BY_COMPONENT.PTS_TAG_ID);
  if (!ptsTag) {
    ptsTag = document.createElement('span');
    ptsTag.id = ID_BY_COMPONENT.PTS_TAG_ID;
    ptsTag.className = 'text-blue-500 ml-2';
    sum.appendChild(ptsTag);
  }
  ptsTag.textContent = `(포인트: ${bonusPts})`;
};

export const updateStockInfo = (productList) => {
  const stockInfo = document.querySelector(`#${ID_BY_COMPONENT.STOCK_INFO_ID}`);

  let infoMsg = '';
  productList.forEach(function (item) {
    if (item.qty < 5) {
      infoMsg += `${item.name}: ${
        item.qty > 0 ? `재고 부족 (${item.qty}개 남음)` : '품절'
      }\n`;
    }
  });

  stockInfo.textContent = infoMsg;
};
