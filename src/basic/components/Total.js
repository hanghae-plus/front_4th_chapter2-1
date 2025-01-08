import { state } from '../store/globalStore';

function Total() {
  const container = document.createElement('div');

  const render = () => {
    const totalAmt = state.get('totalAmt');
    const discountRate = state.get('discountRate');
    const bonusPoint = Math.floor(totalAmt / 1000);

    container.innerHTML = `
   <div id="cart-total" class="text-xl font-bold my-4">총액: ${Math.round(totalAmt)}원${
     discountRate > 0
       ? `<span class="text-green-500 ml-2">(${(discountRate * 100).toFixed(1)}% 할인 적용)</span>`
       : ''
   }<span id="loyalty-points" class="text-blue-500 ml-2">(포인트: ${bonusPoint})</span></div>
`.trim();
  };

  state.subscribe('totalAmt', render);
  state.subscribe('discountRate', render);

  render();

  return container;
}

export default Total;
