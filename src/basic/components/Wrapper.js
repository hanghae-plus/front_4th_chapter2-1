import { html } from '../libs/index.js';
import { Title, SelectedProd, TotalAmount, StockInfo, AddButton, CartDisplay } from '../components/index.js';
import { prodList } from '../store/index.js';
import {
  updateSelectableOptionsDisplay,
  updateStockInfoDisplay,
  updateTotalAmountDisplay,
  setupLightningSale,
  setupSuggestions,
} from '../utils/index.js';
import { registerEvents } from '../event/eventHandler';

const initUI = ({ SelectedProdComponent, StockInfoComponent, TotalAmountComponent, prodList }) => {
  updateSelectableOptionsDisplay({
    selectedPropComponent: SelectedProdComponent,
    items: prodList,
  });
  updateStockInfoDisplay({ StockInfoComponent, prodList });
  updateTotalAmountDisplay({
    totalAmountComponent: TotalAmountComponent,
    amount: 0,
    discountRate: 0,
    withPoints: true, // 포인트까지 표시
  });
};

export function Wrapper() {
  // Wrapper 내에서만 관리할 상태
  let lastSelectedId = null;

  // 컴포넌트 인스턴스 생성
  const TitleComponent = Title();
  const SelectedProdComponent = SelectedProd();
  const TotalAmountComponent = TotalAmount();
  const StockInfoComponent = StockInfo();
  const CartDisplayComponent = CartDisplay();
  const AddButtonComponent = AddButton();

  // 초기 렌더링 & UI 세팅
  initUI({
    SelectedProdComponent,
    StockInfoComponent,
    TotalAmountComponent,
    prodList,
  });

  // 이벤트 등록
  registerEvents({
    // 장바구니 영역 & Add 버튼
    CartDisplayComponent,
    AddButtonComponent,
    // 상품 관련 컴포넌트
    SelectedProdComponent,
    TotalAmountComponent,
    StockInfoComponent,
    // 데이터
    prodList,
    // "객체 형태"로 lastSelectedId를 참조. (값을 갱신해야 하므로)
    lastSelectedIdRef: { value: lastSelectedId },
  });

  // "번개세일" & "추천 상품" 타이머
  setupLightningSale({
    SelectedProdComponent,
    prodList,
  });
  setupSuggestions({
    SelectedProdComponent,
    prodList,
    lastSelectedIdRef: { value: lastSelectedId },
  });

  // 최종 DOM 구조 반환
  return html`
    <div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
      ${TitleComponent} ${CartDisplayComponent} ${TotalAmountComponent} ${SelectedProdComponent} ${AddButtonComponent} ${StockInfoComponent}
    </div>
  `;
}
