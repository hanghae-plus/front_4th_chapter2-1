import { createElement } from '../core/createElement.js';

//결제 정보
export const PaymentInfo = () => {
  const container = createElement('div', {
    id: 'cart-total',
    className: 'text-xl font-bold my-4'
  });

  const totalText = createElement('span', {
    textContent: '총액: 0원'
  });
  const pointDisplay = DisplayPoint();

  container.append(totalText, pointDisplay);
  return container;
};

//포인트 정보
export const DisplayPoint = () => {
  return createElement('span', {
    id: 'loyalty-points',
    className: 'text-blue-500 ml-2',
    textContent: '(포인트: 0)'
  });
};
