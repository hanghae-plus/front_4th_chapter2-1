/**
 * 상품 정보 목록 (PRODUCTS)
 *  - id : 고유 ID
 *  - name : 상품명
 *  - price : 상품 가격
 *  - quantity : 재고 수량
 */
export const PRODUCTS = [
	{ id: 'p1', name: '상품1', price: 10000, quantity: 50 },
	{ id: 'p2', name: '상품2', price: 20000, quantity: 30 },
	{ id: 'p3', name: '상품3', price: 30000, quantity: 20 },
	{ id: 'p4', name: '상품4', price: 15000, quantity: 0 },
	{ id: 'p5', name: '상품5', price: 25000, quantity: 10 },
];

/**
 * 상품 별 할인율
 * key : product_id
 * value : 할인율
 */
export const DISCOUNT_PER_PRODUCTS = {
	p1: 0.1,
	p2: 0.15,
	p3: 0.2,
	p4: 0.05,
	p5: 0.25,
};

/**
 * 재고 알림 숫자
 * ALMOST_OUT : 부족 알림 보낼 숫자 값
 * OUT_OF_STOCK : 0
 */
export const STOCK_ALERT_THRESHOLDS = {
	ALMOST_OUT: 5,
	OUT_OF_STOCK: 0,
};

/**
 * 할인율
 */
export const DISCOUNT_RATE = {
	FIVE_PERCENT: 0.95,
	TEN_PERCENT: 0.9,
	FIFTEEN_PERCENT: 0.85,
	TWENTY_PERCENT: 0.8,
	TWENTYFIVE_PERCENT: 0.75,
};
