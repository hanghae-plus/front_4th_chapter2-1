import { setupUI } from "./ui/ui";
import { updatePickProduct } from "./product/product";
import { setupPromotions } from "./promotions/promotions";
import { calculateCart } from "./cart/cart";

/**
 * 메인 함수: 초기화 작업 수행
 * - 상품 목록 초기화
 * - UI 생성
 * - 초기 상품 옵션 설정
 * - 초기 장바구니 계산
 * - 프로모션 설정
 */
function main() {
  setupUI(); // UI 생성 및 이벤트 바인딩
  updatePickProduct(); // 상품 선택 옵션 업데이트
  calculateCart(); // 장바구니 초기 계산
  setupPromotions(); // 프로모션 설정
}

main();