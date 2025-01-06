import { state } from '../store/globalStore';

function Point() {
  const totalAmt = state.get('totalAmt');

  const updatePointUI = () => {
    const bonusPoint = Math.floor(totalAmt / 1000);
    let pointTag = document.getElementById('loyalty-points');

    if (!pointTag) {
      pointTag = document.createElement('span');
      pointTag.id = 'loyalty-points';
      pointTag.className = 'text-blue-500 ml-2';
      const cartTotal = document.getElementById('cart-total');
      if (cartTotal) {
        cartTotal.appendChild(pointTag);
      }
    }

    pointTag.textContent = '(포인트: ' + bonusPoint + ')';
  };

  state.subscribe('totalAmt', updatePointUI);

  updatePointUI();
}

export default Point;
