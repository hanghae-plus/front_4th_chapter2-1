import { DISCOUNT_PER_PRODUCTS, DISCOUNT_RATE, STOCK_ALERT_THRESHOLDS } from '../constants';
import { CartStore } from '../store/cartStore';
import { ProductStore } from '../store/productStore';
import { IPRODUCT } from '../types';
import { alert20PercentSale, alert5PercentSale } from './alert';

/**
 * 장바구니 내역 계산
 */
export function calculateCart() {
	const cart = CartStore.getState().cart;

	let totalAmount = 0; // 총합
	let itemCount = 0; // 아이템 개수
	let totalBeforeDiscount = 0; // 할인 금액 적용 전 총합

	cart.forEach((cartItem) => {
		const quantity = cartItem.quantity;
		const itemTotal = cartItem.price * quantity; // 아이템 별 금액 총합

		itemCount += quantity;
		totalBeforeDiscount += itemTotal;

		// 10개 이상 주문 시 할인
		const discount = quantity >= 10 ? DISCOUNT_PER_PRODUCTS[cartItem.id] : 0;
		totalAmount += itemTotal * (1 - discount);
	});

	let discountRate = applyDiscounts(
		itemCount,
		totalAmount,
		totalBeforeDiscount,
		new Date().getDay(),
	); // 할인율 계산

	return { totalAmount, discountRate };
}

function applyDiscounts(
	totalQuantity: number,
	totalAmount: number,
	totalBeforeDiscount: number,
	day: number,
) {
	let discountRate = 0;

	if (totalQuantity >= 30) {
		// 30 개 이상이면 할인
		const TWENTYFIVE_DISCOUNT = 1 - DISCOUNT_RATE.TWENTYFIVE_PERCENT;

		const bulkDiscountAmount = totalAmount * TWENTYFIVE_DISCOUNT; // 대량 구매 시 할인 금액
		const itemDiscountTotal = totalBeforeDiscount - totalAmount; // 아이템 별 할인 후 적용 금액

		if (bulkDiscountAmount > itemDiscountTotal) {
			totalAmount = totalBeforeDiscount * (1 - TWENTYFIVE_DISCOUNT);
			discountRate = TWENTYFIVE_DISCOUNT;
		} else {
			discountRate = (totalBeforeDiscount - totalAmount) / totalBeforeDiscount;
		}
	} else {
		discountRate = (totalBeforeDiscount - totalAmount) / totalBeforeDiscount;
	}

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

/**
 * sale alert 이벤트
 */
export function setupSaleEvents() {
	const products = ProductStore.getState().products;
	const lastSelectedItemId = CartStore.getState().lastSelectedItemId;

	setTimeout(function () {
		setInterval(function () {
			const luckyItem = products[Math.floor(Math.random() * products.length)];
			if (Math.random() < 0.3 && luckyItem.quantity > 0) {
				luckyItem.price = Math.round(luckyItem.price * DISCOUNT_RATE.TWENTY_PERCENT);
				alert20PercentSale(luckyItem.name);
			}
		}, 30000);
	}, Math.random() * 10000);

	setTimeout(function () {
		setInterval(function () {
			if (lastSelectedItemId) {
				const suggestItem = products.find(
					(item) => item.id !== lastSelectedItemId && item.quantity > 0,
				);
				if (suggestItem) {
					alert5PercentSale(suggestItem.name);
					suggestItem.price = Math.round(suggestItem.price * DISCOUNT_RATE.FIVE_PERCENT);
				}
			}
		}, 60000);
	}, Math.random() * 20000);
}
