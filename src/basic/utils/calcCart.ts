import { cartStore } from '@/stores/cartStore';
import { DISCOUNT_RATES } from '@/types/constant';

export const calcCart = () => {
  let totalAmount = 0;
  let itemCount = 0;
  const cartItemsElement = document.getElementById('cart-items');
  const cartItems = cartItemsElement
    ? (Array.from(cartItemsElement.children) as HTMLElement[])
    : [];
  let subTotal = 0;
  const productList = cartStore.get('productList');

  for (let i = 0; i < cartItems.length; i++) {
    (function () {
      let currentItem;

      for (let j = 0; j < productList.length; j++) {
        if (productList[j].id === cartItems[i].id) {
          currentItem = productList[j];
          break;
        }
      }

      if (currentItem) {
        const stock = parseInt(
          cartItems[i].querySelector('span')?.textContent?.split('x ')[1] || '0'
        );
        const itemTotal = currentItem?.price * stock;
        let discount = 0;

        itemCount += stock;
        subTotal += itemTotal;

        if (stock >= 10) {
          discount = DISCOUNT_RATES[currentItem.id];
        }
        totalAmount += itemTotal * (1 - discount);
      }
    })();
  }

  let discountRate = 0;

  if (itemCount >= 30) {
    const bulkDiscount = totalAmount * 0.25;
    const itemDiscount = subTotal - totalAmount;

    if (bulkDiscount > itemDiscount) {
      totalAmount = subTotal * (1 - 0.25);
      discountRate = 0.25;
    } else {
      discountRate = (subTotal - totalAmount) / subTotal;
    }
  } else {
    discountRate = (subTotal - totalAmount) / subTotal;
  }

  if (new Date().getDay() === 2) {
    totalAmount *= 1 - 0.1;
    discountRate = Math.max(discountRate, 0.1);
  }

  cartStore.set('totalAmount', totalAmount);
  cartStore.set('itemCount', itemCount);
  cartStore.set('discountRate', discountRate);
};
