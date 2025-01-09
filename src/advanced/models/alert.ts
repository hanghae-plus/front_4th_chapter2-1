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
