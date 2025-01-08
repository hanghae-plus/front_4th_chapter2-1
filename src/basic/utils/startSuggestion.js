import { updateSelectOptions } from '../components/productSelect/updateSelectOptions';
import { CONSTANTS } from '../constants';
import { helper } from './helper';
import { startPromotion } from './startPromotion';

/**
 * 추천 프로모션 시작
 * @description 전달받은 제품 목록에서 추천 프로모션 시작
 * - 특정 간격과 딜레이로 실행
 * @param {*} products
 * @param {*} lastSelectedItem
 */
export function startSuggestion(products, lastSelectedItem) {
  startPromotion(
    () => runSuggestion(products, lastSelectedItem),
    CONSTANTS.SUGGESTION_INTERVAL,
    CONSTANTS.SUGGESTION_DELAY,
  );
}

/**
 * 추천 프로모션 실행
 * @description 마지막으로 선택된 제품을 제외한 제품 중 수량이 남아 있는 항목을 찾아 추천
 * - 추천된 제품은 할인가로 변경되며, UI 선택 옵션이 업데이트됨
 * @param {*} products - 추천 프로모션 대상 제품 리스트
 * @param {*} lastSelectedItem - 마지막으로 선택된 제품 ID
 */
function runSuggestion(products, lastSelectedItem) {
  if (!lastSelectedItem) return;

  const suggest = products.find(
    item => item.id !== lastSelectedItem && item.quantity > 0,
  );

  if (suggest) {
    alert(helper.getSuggestionMessage(suggest.name));
    suggest.price = Math.round(
      suggest.price * CONSTANTS.SUGGESTION_DISCOUNT_RATE,
    );
    updateSelectOptions(products);
  }
}
