import { cartStore } from '@/stores/cartStore';
import { DISCOUNT_RATES, SALE_DAY } from '@/types/constant';

export const calcCart = () => {
  let totalAmount = 0;
  let itemCount = 0;
  let subTotal = 0;
  const productList = cartStore.get('productList');

  const cartItemsElement = document.getElementById('cart-items');
  const cartItems = cartItemsElement
    ? (Array.from(cartItemsElement.children) as HTMLElement[])
    : [];

  cartItems.forEach((cartItem) => {
    const currentItem = productList.find((product) => product.id === cartItem.id);

    if (currentItem) {
      let discount = 0;
      const stock = parseInt(cartItem.querySelector('span')?.textContent?.split('x ')[1] || '0');
      const itemTotal = currentItem.price * stock;

      itemCount += stock;
      subTotal += itemTotal;

      if (stock >= 10) {
        discount = DISCOUNT_RATES[currentItem.id];
      }
      totalAmount += itemTotal * (1 - discount);
    }
  });

  const result = calculateDiscount(totalAmount, itemCount, subTotal);

  totalAmount = result.totalAmount;
  let discountRate = result.discountRate;

  const finalResult = calculateSaleDiscount(totalAmount, discountRate);

  totalAmount = finalResult.totalAmount;
  discountRate = finalResult.discountRate;

  cartStore.set('totalAmount', totalAmount);
  cartStore.set('itemCount', itemCount);
  cartStore.set('discountRate', discountRate);
};

const calculateDiscount = (totalAmount: number, itemCount: number, subTotal: number) => {
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

  return { totalAmount, discountRate };
};

const calculateSaleDiscount = (totalAmount: number, discountRate: number) => {
  if (new Date().getDay() === SALE_DAY) {
    totalAmount *= 1 - 0.1;
    discountRate = Math.max(discountRate, 0.1);
  }

  return { totalAmount, discountRate };
};
