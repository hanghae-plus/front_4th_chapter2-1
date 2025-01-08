import { createElement as h } from '../utils/createElement';
import { $ } from '../utils/dom.utils';

export const renderBonusPoint = (totalAmount: number) => {
  const bonusPoint = Math.floor(totalAmount / 1000);
  const pointText = `(포인트: ${bonusPoint})`;
  const existingPointTag = $('#loyalty-points');

  if (existingPointTag) {
    existingPointTag.textContent = pointText;

    return;
  }

  const newPointTag = h('span', {
    id: 'loyalty-points',
    className: 'text-blue-500 ml-2',
    textContent: pointText,
  });

  $('#cart-total').appendChild(newPointTag);
};
