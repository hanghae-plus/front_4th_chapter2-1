import { DISCOUNT_PER_PRODUCTS, DISCOUNT_RATE, STOCK_ALERT_THRESHOLDS } from '../constants';
import { CartStore, ProductStore } from '../store';
import { IPRODUCT } from '../types';

type ApplyDiscountParam = {
	totalQuantity: number;
	totalAmount: number;
	totalBeforeDiscount: number;
	day: number;
};

/**
 * 장바구니 내역 계산
 */
export function calculateCart() {
	const cart = CartStore.getState().cart;

	let totalAmount = 0; // 총합
	let itemCount = 0; // 아이템 개수
	let totalBeforeDiscount = 0; // 할인 금액 적용 전 총합

	cart.forEach((cartItem) => {
		const { quantity, price, id } = cartItem;
		const itemTotal = price * quantity; // 아이템 별 금액 총합

		itemCount += quantity;
		totalBeforeDiscount += itemTotal;

		// 10개 이상 주문 시 할인
		const discount = quantity >= 10 ? DISCOUNT_PER_PRODUCTS[id] : 0;
		totalAmount += itemTotal * (1 - discount);
	});

	const discountRate = applyDiscounts({
		totalQuantity: itemCount,
		totalAmount,
		totalBeforeDiscount,
		day: new Date().getDay(),
	});

	return { totalAmount, discountRate };
}

/**
 * 할인율 적용, 계산
 */
function applyDiscounts({
	totalQuantity,
	totalAmount,
	totalBeforeDiscount,
	day,
}: ApplyDiscountParam): number {
	let discountRate = 0;

	// 30 개 이상이면 할인
	if (totalQuantity >= 30) {
		const TWENTYFIVE_DISCOUNT = 1 - DISCOUNT_RATE.TWENTYFIVE_PERCENT; // 0.25

		const bulkDiscountAmount = totalAmount * TWENTYFIVE_DISCOUNT; // 대량 구매 시 할인 금액
		const itemDiscountTotal = totalBeforeDiscount - totalAmount; // 아이템 별 할인 후 적용 금액

		if (bulkDiscountAmount > itemDiscountTotal) {
			totalAmount = totalBeforeDiscount * DISCOUNT_RATE.TWENTYFIVE_PERCENT;
			discountRate = TWENTYFIVE_DISCOUNT;
		} else {
			discountRate = (totalBeforeDiscount - totalAmount) / totalBeforeDiscount;
		}
	} else {
		discountRate = (totalBeforeDiscount - totalAmount) / totalBeforeDiscount;
	}

	// 화요일 할인 적용 : 10%
	if (day === 2) {
		totalAmount *= DISCOUNT_RATE.TEN_PERCENT;
		discountRate = Math.max(discountRate, 0.1);
	}

	return discountRate;
}

/**
 * 재고 업데이트
 */
export function updateStockInfo(product: IPRODUCT[]) {
	let infoMessage = product
		?.filter((item) => item.quantity < STOCK_ALERT_THRESHOLDS.ALMOST_OUT)
		.map((item) =>
			item.quantity > STOCK_ALERT_THRESHOLDS.OUT_OF_STOCK
				? `${item.name}: 재고 부족 (${item.quantity})개 남음`
				: `${item.name}: 품절`,
		)
		.join('\n');

	return infoMessage;
}
