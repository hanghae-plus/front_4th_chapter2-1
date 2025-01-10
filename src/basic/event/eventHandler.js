import { calculateCart, updateTotalAmountDisplay, updateBonusPointsDisplay, updateStockInfoDisplay } from '../utils/index.js';

function handleAddToCart({ SelectedProdComponent, CartDisplayComponent, prodList, lastSelectedIdRef, refreshCartUI }) {
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
      return;
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

  // 선택된 상품 id 갱신
  lastSelectedIdRef.value = selValue;

  // 장바구니 UI 갱신
  refreshCartUI();
}

function handleCartItemClick({ event, CartDisplayComponent, prodList, TotalAmountComponent, StockInfoComponent, refreshCartUI }) {
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

    // 재고 = product.qty + oldQty (현재 아이템이 차지 중인 수량 + 남은 재고)
    const maxPossible = product.qty + oldQty;
    if (newQty > 0 && newQty <= maxPossible) {
      // 수량 변경
      span.textContent = `${product.name} - ${product.val}원 x ${newQty}`;
      // product 재고 반영
      product.qty -= change;
    } else if (newQty <= 0) {
      // 아이템 제거
      itemDom.remove();
      // 장바구니에서 빼준 만큼 재고 복원
      product.qty += oldQty;
    } else {
      alert('재고가 부족합니다.');
      return;
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

/**
 * 장바구니 합계 & UI 갱신
 */
function refreshCartUI({ CartDisplayComponent, TotalAmountComponent, StockInfoComponent, prodList }) {
  const { totalAmount, discountRate } = calculateCart({
    cartDisplayComponent: CartDisplayComponent,
    prodList,
  });

  updateTotalAmountDisplay({
    totalAmountComponent: TotalAmountComponent,
    amount: totalAmount,
    discountRate,
    withPoints: false, // 이미 별도의 updateBonusPointsDisplay에서 처리
  });

  updateBonusPointsDisplay({ totalAmount });

  updateStockInfoDisplay({
    StockInfoComponent,
    prodList,
  });
}

// AddButton, CartDisplay 등 이벤트를 등록
export function registerEvents({
  CartDisplayComponent,
  AddButtonComponent,
  SelectedProdComponent,
  TotalAmountComponent,
  StockInfoComponent,
  prodList,
  lastSelectedIdRef,
}) {
  // "장바구니 담기" 버튼 이벤트
  AddButtonComponent.setProps({
    onClick: () =>
      handleAddToCart({
        SelectedProdComponent,
        CartDisplayComponent,
        prodList,
        lastSelectedIdRef,
        refreshCartUI: () =>
          refreshCartUI({
            CartDisplayComponent,
            TotalAmountComponent,
            StockInfoComponent,
            prodList,
          }),
      }),
  });

  // 장바구니 내 아이템 클릭 이벤트(수량 +/-/삭제)
  CartDisplayComponent.setProps({
    onClick: event =>
      handleCartItemClick({
        event,
        CartDisplayComponent,
        prodList,
        TotalAmountComponent,
        StockInfoComponent,
        refreshCartUI: () =>
          refreshCartUI({
            CartDisplayComponent,
            TotalAmountComponent,
            StockInfoComponent,
            prodList,
          }),
      }),
  });
}
