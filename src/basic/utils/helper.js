/**
 * @param {string} name - 상품 이름
 * @return {string} 번개세일! {name}이(가) 20% 할인 중입니다!
 */
const getLightningSaleMessage = name =>
  `번개세일! ${name}이(가) 20% 할인 중입니다!`;

/**
 * @param {string} name - 상품 이름
 * @return {string} {name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!
 */
const getSuggestionMessage = name =>
  `${name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`;

/**
 * @param {string} name - 상품 이름
 * @param {number} price - 가격
 * @return {string} {name} - {price}원
 */
const getNameAndPriceMessage = (name, price) => `${name} - ${price}원`;

/**
 * @param {number} amount - 총액
 * @return {string} 총액: {amount}원
 */
const getTotalAmountMessage = amount => `총액: ${amount}원`;

/**
 * @param {number} amount - 할인 금액
 * @return {string} ({amount}% 할인 적용)
 */
const getDiscountedAmountMessage = amount => `(${amount}% 할인 적용)`;

/**
 * @param {string} name - 상품 이름
 * @param {number} quantity - 재고
 * @return {string} {name}: {quantity > 0 ? '재고 부족 (' + quantity + '개 남음)' : '품절'}
 */
const getWarningMessage = (name, quantity) =>
  `${name}: ${quantity > 0 ? '재고 부족 (' + quantity + '개 남음)' : '품절'}\n`;

export const helper = {
  getLightningSaleMessage,
  getSuggestionMessage,
  getNameAndPriceMessage,
  getTotalAmountMessage,
  getDiscountedAmountMessage,
  getWarningMessage,
};
