import { insertDiscountInfo } from './discount';

export const insertItemInfo = (targetProduct, targetItem, itemQuantity) => {
	const newCartItemInfo = `${targetProduct.name} - ${targetProduct.price}원 x ${itemQuantity}`;
	targetItem.querySelector('span').textContent = newCartItemInfo;
};

export const insertCartTotal = (discountedTotalPrice, discountRate) => {
	const $cartTotal = document.getElementById('cart-total');

	$cartTotal.textContent = `총액: ${Math.round(discountedTotalPrice)}원`;
	if (discountRate > 0) {
		const discountInfo = insertDiscountInfo(discountRate);
		$cartTotal.appendChild(discountInfo);
	}
};
