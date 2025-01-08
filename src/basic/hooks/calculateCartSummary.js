import { productList } from '../data/productList.js';
import { updateStockInfo } from './updateStockInfo.js';
import {
  cartDisplay,
  cartTotal,
  getItemCount,
  getTotalAmount,
  setItemCount,
  setTotalAmount,
} from '../main.basic.js';
import { updateBonusPoints } from './updateBonusPoints.js';

// 1. 로직 -> 안쪽부터 수정하는 게 편하다?
// 2. if문 수정 (방법들 중 하나 함수 - 재사용 / 가독성 - 추상화), 반복문 수정(배열 메서드 등의 고차함수 활용)
// -> 깔끔하게 쓰고 싶다면,
// if문을 쓸 수 있는 곳은 함수 내부 -> 반복되는 if문이다?
// 삼항연산자

export function calculateCartSummary() {
  const cartItems = cartDisplay.children;
  let subTotal = 0;

  for (let i = 0; i < cartItems.length; i++) {
    (function () {
      let currentItem;
      for (let j = 0; j < productList.length; j++) {
        if (productList[j].id === cartItems[i].id) {
          currentItem = productList[j];
          break;
        }
      }
      const quantity = parseInt(
        cartItems[i].querySelector('span').textContent.split('x ')[1],
      );
      const itemTotal = currentItem.price * quantity;
      let discount = 0;
      setItemCount((prevItemCount) => prevItemCount + quantity);
      subTotal += itemTotal;

      const DISCOUNT_RATE = {
        p1: 0.1,
        p2: 0.15,
      };

      // 10, 저런 매직 넘버를 상수 처리
      if (quantity >= 10) {
        discount = DISCOUNT_RATE[currentItem.id];

        // 아래는 주석했다고 생각하고
        if (currentItem.id === 'p1') discount = 0.1;
        else if (currentItem.id === 'p2') discount = 0.15;
        else if (currentItem.id === 'p3') discount = 0.2;
        else if (currentItem.id === 'p4') discount = 0.05;
        else if (currentItem.id === 'p5') discount = 0.25;
        // 3가지 - 이외에 사용할 수 있는 방법

        // 1. switch - 좋은 방법인가? - 쓸 곳이 많지는 않을 듯
        // -> 같은 값이더라도? 조건을 상세하게, default => if문과 다르지 않다.
        // if문은 조건이어서 -> 성능(얼마 연산 안 하는 거여서 상관 없다고 생각하는데)
        // 조건 처리를 복잡하게 보일 수도 있다...
        // 예시는 생각이 안 나는데, switch문이 중요할 때가 있습니다. -> case 명확하고 깔끔하게

        // 2. 객체 활용 -> 이 케이스는, 적절하지 않을까? // 위에 것처럼 상수 활용이 가능하고, 키가 문자열이 가능한 경우는 가능한데,

        // 3. 함수 -> 자유분방. 내가 원하는 대로 할 수 있다.

        // 과한 조건을 줄이는 (과한 조건이 있을 수 있음 - 잘못 짠 거 - 짜다 보면 그럴 수 있으니까)
      }

      setTotalAmount(
        (prevTotalAmount) => prevTotalAmount + itemTotal * (1 - discount),
      );
    })();
  }
  let discountRate = 0;

  // 조건 전체를 할당하는 것도 방법입니다.
  if (getItemCount() >= 30) {
    const bulkDiscount = getTotalAmount() * 0.25;
    const itemDiscount = subTotal - getTotalAmount();
    if (bulkDiscount > itemDiscount) {
      setTotalAmount(subTotal * (1 - 0.25));
      discountRate = 0.25;
    } else {
      discountRate = (subTotal - getTotalAmount()) / subTotal;
    }
  } else {
    discountRate = (subTotal - getTotalAmount()) / subTotal;
  }
  if (new Date().getDay() === 2) {
    setTotalAmount((prevTotalAmount) => prevTotalAmount * (1 - 0.1));
    discountRate = Math.max(discountRate, 0.1);
  }
  cartTotal.textContent = '총액: ' + Math.round(getTotalAmount()) + '원';
  if (discountRate > 0) {
    const span = document.createElement('span');
    span.className = 'text-green-500 ml-2';
    span.textContent = '(' + (discountRate * 100).toFixed(1) + '% 할인 적용)';
    cartTotal.appendChild(span);
  }
  updateStockInfo();
  updateBonusPoints();
}
