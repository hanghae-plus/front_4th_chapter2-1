import { updateSelectOptions } from '../components/productSelect/updateSelectOptions';
import { CONSTANTS } from '../constants';
import { helper } from './helper';
import { startPromotion } from './startPromotion';

/**
 * 번개 세일 시작
 * @description 전달받은 제품 목록에서 랜덤으로 선택된 제품에 번개 세일 적용
 * - 특정 간격과 딜레이로 실행
 * @param {*} products - 번개 세일 대상 제품 리스트.
 * @returns {void}
 */
export function startLightningSale(products) {
  startPromotion(
    () => runLightningSale(products),
    CONSTANTS.LIGHTNING_SALE_INTERVAL,
    CONSTANTS.LIGHTNING_SALE_DELAY,
  );
}

/**
 * 번개 세일 실행
 * @description 제품 목록에서 랜덤으로 제품을 선택하여 세일 조건 충족 시 할인 적용
 * - 할인된 제품으로 UI 선택 옵션이 업데이트됨
 * @param {*} products - 번개 세일 대상 제품 리스트
 * @returns {void}
 */
function runLightningSale(products) {
  const luckyItem = products[Math.floor(Math.random() * products.length)];

  if (Math.random() < CONSTANTS.RANDOM_SALE_RATE && luckyItem.quantity > 0) {
    luckyItem.price = Math.round(
      luckyItem.price * CONSTANTS.LIGHTNING_SALE_RATE,
    );
    alert(helper.getLightningSaleMessage(luckyItem.name));
    updateSelectOptions(products);
  }
}
