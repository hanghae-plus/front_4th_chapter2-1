import { CartStore } from '../../store/cartStore';
import { ProductStore } from '../../store/productStore';
import { addEventListener } from '../../utils/eventUtil';

import type { Product } from '../../store/cartStore';

export const ProductSelector = () => {
  const { actions: ProductActions, observer: productObserver } = ProductStore;
  const { actions: CartActions, observer: cartObserver } = CartStore;

  cartObserver.addObserver({
    update: () => {
      // rerender 처리
    },
  });

  productObserver.addObserver({
    update: () => {
      // rerender 처리
    },
  });

  const productList = ProductActions.getProductList();

  // INFO: "추가" 버튼 클릭 핸들러
  addEventListener('click', function (event: MouseEvent) {
    // addBtn 클릭인지 확인해야함

    if (!(event.target instanceof HTMLButtonElement) || event.target.id !== 'add-cart') return;

    const select = document.getElementById('product-select') as HTMLSelectElement;

    const selectItem = select.value;

    //   prodList에서 id와 같은 필드 찾기
    const targetItem = productList?.find(function (p) {
      return p.id === selectItem;
    });

    if (targetItem && targetItem.q > 0) {
      const item = document.getElementById(targetItem.id);

      if (item) {
        const newQty = parseInt(item.querySelector('span').textContent.split('x ')[1]) + 1;
        if (newQty <= targetItem.q) {
          item.querySelector('span').textContent = targetItem.name + ' - ' + targetItem.val + '원 x ' + newQty;
          ProductActions.decreaseQ(targetItem.id);
        } else {
          alert('재고가 부족합니다.');
        }
      } else {
        addCart(targetItem);
        ProductActions.decreaseQ(targetItem.id);
      }

      // calcCart();
      // lastSel = selItem;
    }
  });

  function addCart(targetItem: Product) {
    CartActions.addCartItem(targetItem);
  }

  const render = `
        <select id="product-select" class="border rounded p-2 mr-2">
        ${
          productList &&
          productList.map((product) => {
            const isDisabled = product.q === 0 ? 'disabled' : '';

            return `<option value="${product.id}" ${isDisabled}>${product.name} - ${product.val}원</option>`;
          })
        }
        </select>
        <button id="add-cart" class="bg-blue-500 text-white px-4 py-2 rounded">추가</button>
    `;

  return { render };
};
