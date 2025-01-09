/**
 * 상품 정보 목록 (PRODUCT)
 *  - id : 고유 ID
 *  - name : 상품명
 *  - price : 상품 가격
 *  - quantity : 재고 수량
 */
export interface IPRODUCT {
	id: string;
	name: string;
	price: number;
	quantity: number;
}
