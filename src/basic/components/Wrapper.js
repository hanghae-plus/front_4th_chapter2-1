// src/basic/components/Wrapper.js

import { html } from '../libs/index.js';
import { Title, SelectedProd, TotalAmount, StockInfo, AddButton, CartDisplay } from './index.js';
import {
  updateSelectableOptionsDisplay,
  updateStockInfoDisplay,
  updateTotalAmountDisplay,
  calculateCart,
  updateBonusPointsDisplay,
} from '../utils/index.js';
import { prodList } from '../store/index.js';

// "번개세일", "추천 상품" 관련
let lastSelectedId = null;

export function Wrapper() {
  // 1) 컴포넌트 인스턴스 생성
  const TitleComponent = Title();
  const SelectedProdComponent = SelectedProd();
  const TotalAmountComponent = TotalAmount();
  const StockInfoComponent = StockInfo();
  const CartDisplayComponent = CartDisplay(); // <div id="cart-items">...</div>
  const AddButtonComponent = AddButton();

  // 2) 초기 렌더링 & UI 세팅
  // (selectBox, stockInfo, totalAmount 등)
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

  // 3) 이벤트 등록
  AddButtonComponent.setProps({
    onClick: () => handleAddToCart(),
  });
  CartDisplayComponent.setProps({
    onClick: event => handleCartItemClick(event),
  });

  // 4) "번개세일" & "추천 상품" 타이머
  setupLightningSale();
  setupSuggestions();

  // 5) 최종 DOM 구조 반환
  return html`
    <div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
      ${TitleComponent} ${CartDisplayComponent} ${TotalAmountComponent} ${SelectedProdComponent} ${AddButtonComponent} ${StockInfoComponent}
    </div>
  `;

  // -------------------------------------
  // 이벤트 핸들러 함수들
  // -------------------------------------

  function handleAddToCart() {
    // 선택된 상품
    const selValue = SelectedProdComponent.get('element').value;
    const productToAdd = prodList.find(p => p.id === selValue);

    if (!productToAdd) return;

    // 재고 체크
    if (productToAdd.qty <= 0) {
      alert('재고가 부족합니다.');
      return;
    }

    // CartDisplay의 실제 DOM
    const cartContainer = CartDisplayComponent.get('element');
    // 아이템이 이미 있는지 체크
    const existingItemDom = cartContainer.querySelector('#' + productToAdd.id);

    if (existingItemDom) {
      // 이미 있는 경우 => 수량 +1
      const span = existingItemDom.querySelector('span');
      const oldQty = parseInt(span.textContent.split('x ')[1], 10);
      const newQty = oldQty + 1;

      if (newQty <= productToAdd.qty) {
        productToAdd.qty -= 1; // 재고 소모
        span.textContent = `${productToAdd.name} - ${productToAdd.val}원 x ${newQty}`;
      } else {
        alert('재고가 부족합니다.');
      }
    } else {
      // 새 DOM 노드
      const newDiv = document.createElement('div');
      newDiv.id = productToAdd.id;
      newDiv.className = 'flex justify-between items-center mb-2';

      newDiv.innerHTML = `
        <span>${productToAdd.name} - ${productToAdd.val}원 x 1</span>
        <div>
          <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
                  data-product-id="${productToAdd.id}"
                  data-change="-1">-</button>
          <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
                  data-product-id="${productToAdd.id}"
                  data-change="1">+</button>
          <button class="remove-item bg-red-500 text-white px-2 py-1 rounded"
                  data-product-id="${productToAdd.id}">삭제</button>
        </div>
      `;

      cartContainer.appendChild(newDiv);
      productToAdd.qty -= 1; // 재고 소모
    }

    lastSelectedId = selValue;
    refreshCartUI();
  }

  function handleCartItemClick(event) {
    const target = event.target;
    if (!target) return;

    // 수량 증가/감소
    if (target.classList.contains('quantity-change')) {
      const productId = target.dataset.productId;
      const change = parseInt(target.dataset.change, 10);

      const product = prodList.find(p => p.id === productId);
      const itemDom = CartDisplayComponent.get('element').querySelector('#' + productId);

      if (!itemDom || !product) return;
      const span = itemDom.querySelector('span');
      const oldQty = parseInt(span.textContent.split('x ')[1], 10);
      const newQty = oldQty + change;

      // 재고 = product.qty + oldQty (현재 아이템이 점유중인 수량 + 남은 재고)
      const maxPossible = product.qty + oldQty;
      if (newQty > 0 && newQty <= maxPossible) {
        // 수량 변경
        span.textContent = `${product.name} - ${product.val}원 x ${newQty}`;
        // product 재고 반영
        product.qty = product.qty - change;
      } else if (newQty <= 0) {
        // 아이템 제거
        itemDom.remove();
        // 장바구니에서 빼준 만큼 재고 복원
        product.qty += oldQty;
      } else {
        alert('재고가 부족합니다.');
      }

      refreshCartUI();
    }
    // 아이템 삭제
    else if (target.classList.contains('remove-item')) {
      const productId = target.dataset.productId;
      const product = prodList.find(p => p.id === productId);
      const itemDom = CartDisplayComponent.get('element').querySelector('#' + productId);

      if (!itemDom || !product) return;
      const span = itemDom.querySelector('span');
      const oldQty = parseInt(span.textContent.split('x ')[1], 10);

      // 재고 복구
      product.qty += oldQty;
      itemDom.remove();

      refreshCartUI();
    }
  }

  // 장바구니 합계 및 UI 갱신
  function refreshCartUI() {
    const { totalAmount, discountRate } = calculateCart({
      cartDisplayComponent: CartDisplayComponent,
      prodList,
    });

    updateTotalAmountDisplay({
      totalAmountComponent: TotalAmountComponent,
      amount: totalAmount,
      discountRate,
      withPoints: false, // 이미 별도의 updateBonusPointsDisplay에서 처리해도 됨
    });

    // 새로 만든 함수 (또는 기존 함수) 호출
    updateBonusPointsDisplay({ totalAmount });

    updateStockInfoDisplay({ StockInfoComponent, prodList });
  }

  // 번개세일
  function setupLightningSale() {
    setTimeout(() => {
      setInterval(() => {
        const luckyItem = prodList[Math.floor(Math.random() * prodList.length)];
        if (Math.random() < 0.3 && luckyItem.qty > 0) {
          luckyItem.val = Math.round(luckyItem.val * 0.8);
          alert('번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!');
          // selectBox 옵션도 갱신
          updateSelectableOptionsDisplay({
            selectedPropComponent: SelectedProdComponent,
            items: prodList,
          });
        }
      }, 30000);
    }, Math.random() * 10000);
  }

  // 추천 상품
  function setupSuggestions() {
    setTimeout(() => {
      setInterval(() => {
        if (lastSelectedId) {
          const suggest = prodList.find(p => p.id !== lastSelectedId && p.qty > 0);
          if (suggest) {
            alert(suggest.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!');
            suggest.val = Math.round(suggest.val * 0.95);

            updateSelectableOptionsDisplay({
              selectedPropComponent: SelectedProdComponent,
              items: prodList,
            });
          }
        }
      }, 60000);
    }, Math.random() * 20000);
  }
}
