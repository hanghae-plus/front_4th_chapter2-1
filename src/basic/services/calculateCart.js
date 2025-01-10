import { Day } from '../const/day';
import { Discount, DiscountRate } from '../const/discount';
import cartStore from '../stores/cartStore';
import { renderBonusPoint } from './renderBonusPoint';
import { updateStock } from './updateStock';

// 장바구니 계산
export function calculateCart() {
  const { totalAmount, itemCounts, addItemCount, addTotalAmount } = cartStore();

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

      let quantity = parseInt(cartItems[i].querySelector('span').textContent.split('x ')[1]);
      let itemTotal = currentItem.value * quantity;
      let discount = 0;

      addItemCount(quantity);
      subTotal += itemTotal;

      if (10 <= quantity) {
        if (currentItem.id === 'p1') discount = Discount.P1;
        else if (currentItem.id === 'p2') discount = Discount.P2;
        else if (currentItem.id === 'p3') discount = Discount.P3;
        else if (currentItem.id === 'p4') discount = Discount.P4;
        else if (currentItem.id === 'p5') discount = Discount.P5;
      }

      addTotalAmount(itemTotal * (1 - discount));
    })();
  }

  let discountRate = 0;

  // 30개 이상 구매: 대량구매 25% 할인
  if (30 <= itemCounts) {
    const bulkDiscount = totalAmount * Discount.Bulk;
    const itemDiscount = subTotal - totalAmount;

    if (itemDiscount < bulkDiscount) {
      totalAmount = subTotal * (1 - Discount.Bulk);
      discountRate = Discount.Bulk;
    } else {
      discountRate = (subTotal - totalAmount) / subTotal;
    }
  } else {
    discountRate = (subTotal - totalAmount) / subTotal;
  }

  // 화요일(2)이면 10% 할인
  if (new Date().getDay() === Day.Tuesday) {
    totalAmount *= 1 - DiscountRate.Tuesday;
    discountRate = Math.max(discountRate, DiscountRate.Tuesday);
  }

  sum.textContent = `총액: ${Math.round(totalAmount)}원`;

  if (0 < discountRate) {
    <span className="text-green-500 ml-2">({(discountRate * 100).toFixed(1)} % 할인 적용)</span>;
    sum.appendChild(span);
  }

  updateStock();
  renderBonusPoint(totalAmount);
}
