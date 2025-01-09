import {
  CartHeader,
  CartSummary,
  ProductSelect,
  ProductAddButton,
  StockInformation,
  CartItem,
} from "../components/Cart";
import { cartStore, productStore } from "../store";
import { calculateCart, combineStyles } from "../utils";
import { setupPromotion } from "../utils/promotion";

export const Cart = () => {
  // Q. return 될 때 리터럴, DOM 노드를 반환 어느 것을 선택해야할까 ?
  // 이론상 리터럷 방식은 XSS에 취약하고, 파싱같은이유로 DOM 조작보다 느린것으로 알고 있는데
  // 어떤것을 선택해야할지 질문이 필요할 것 같다.

  const $cartContainer = document.createElement("div");
  const $cartWrapper = document.createElement("div");

  const cartContainerStyles = combineStyles("bg-gray-100", "p-8");
  const cartWrapperStyles = combineStyles(
    "max-w-md",
    "mx-auto",
    "bg-white",
    "rounded-xl",
    "shadow-md",
    "overflow-hidden",
    "md:max-w-2xl",
    "p-8",
  );

  $cartContainer.className = cartContainerStyles;
  $cartWrapper.className = cartWrapperStyles;

  // 컴포넌트 생성 및 참조 저장
  const $header = CartHeader();
  const $cartItems = CartItem();
  const $cartSummary = CartSummary();
  const { element: $productSelect, initialize: productSelectInitialize } =
    ProductSelect();
  const $addButton = ProductAddButton();
  const $stockInfo = StockInformation();

  // 컴포넌트 추가
  $cartWrapper.appendChild($header);
  $cartWrapper.appendChild($cartItems);
  $cartWrapper.appendChild($cartSummary);
  $cartWrapper.appendChild($productSelect);
  $cartWrapper.appendChild($addButton);
  $cartWrapper.appendChild($stockInfo);
  $cartContainer.appendChild($cartWrapper);

  // 프로모션 설정
  setupPromotion();

  // 초기화
  productSelectInitialize();
  calculateCart($cartItems);

  // 카트 관련 상태 구독 처리
  cartStore.subscribe("cartState", (newState, prevState) => {
    // lastSelected 변경시에만 계산 실행
    if (newState?.lastSelected !== prevState?.lastSelected) {
      calculateCart($cartItems);
    }
  });

  return $cartContainer;
};
