import { DISCOUNT_RATE, PRODUCTS } from '../constants';
import { CartStore, ProductStore } from '../store';

const MSG_OUT_OF_STOCK = '재고가 부족합니다.';
const MSG_20_PERCENT_SALE = '이(가) 20% 할인 중입니다!';
const MSG_5_PERCENT_SALE = '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!';

/**
 * 재고 부족 alert
 */
export function alertOutOfStock() {
	alert(MSG_OUT_OF_STOCK);
}

/**
 * 20% 번개 세일 alert
 */
export function alert20PercentSale(name: string) {
	alert(`번개세일! ${name} ${MSG_20_PERCENT_SALE}`);
}

/**
 * 5% 세일 alert
 */
export function alert5PercentSale(name: string) {
	alert(`${name} ${MSG_5_PERCENT_SALE}`);
}

/**
 * sale 이벤트 alert
 */
export function setupSaleEvents() {
	const { products, updateProducts } = ProductStore.getState();
	const lastSelectedItemId = CartStore.getState().lastSelectedItemId;

	setTimeout(function () {
		setInterval(function () {
			const randomIdx = Math.floor(Math.random() * products.length);
			const saleItem = products[randomIdx];
			const originalPrice = PRODUCTS[randomIdx].price;

			if (Math.random() < 0.3 && saleItem.quantity > 0) {
				updateProducts({
					...saleItem,
					price: Math.round(originalPrice * DISCOUNT_RATE.TWENTY_PERCENT),
				});

				alert20PercentSale(saleItem.name);
			}
		}, 30000);
	}, Math.random() * 10000);

	setTimeout(function () {
		setInterval(function () {
			if (!lastSelectedItemId) return;

			const suggestItem = products.find(
				(item) => item.id !== lastSelectedItemId && item.quantity > 0,
			);

			if (!suggestItem) return;

			const originalPrice =
				PRODUCTS.find((item) => item.id === suggestItem.id)?.price ?? suggestItem.price;

			updateProducts({
				...suggestItem,
				price: Math.round(originalPrice * DISCOUNT_RATE.FIVE_PERCENT),
			});

			alert5PercentSale(suggestItem.name);
		}, 60000);
	}, Math.random() * 20000);
}
