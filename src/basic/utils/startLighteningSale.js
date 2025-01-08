import { updateSelectOptions } from '../components/productSelect/updateSelectOptions';
import { helper } from './helper';
import { startPromotion } from './startPromotion';

const LIGHTNING_SALE_INTERVAL = 30_000; // 30초마다 번개세일
const LIGHTNING_SALE_DELAY = 10_000; // 번개세일 초기 지연
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
    LIGHTNING_SALE_INTERVAL,
    LIGHTNING_SALE_DELAY,
  );
}

const RANDOM_SALE_RATE = 0.3; // 랜덤 세일 확률
const LIGHTNING_SALE_RATE = 0.8; // 번개세일 할인율
/**
 * 번개 세일 실행
 * @description 제품 목록에서 랜덤으로 제품을 선택하여 세일 조건 충족 시 할인 적용
 * - 할인된 제품으로 UI 선택 옵션이 업데이트됨
 * @param {*} products - 번개 세일 대상 제품 리스트
 * @returns {void}
 */
function runLightningSale(products) {
  const luckyItem = products[Math.floor(Math.random() * products.length)];

  if (Math.random() < RANDOM_SALE_RATE && luckyItem.quantity > 0) {
    luckyItem.price = Math.round(luckyItem.price * LIGHTNING_SALE_RATE);
    alert(helper.getLightningSaleMessage(luckyItem.name));
    updateSelectOptions(products);
  }
}
