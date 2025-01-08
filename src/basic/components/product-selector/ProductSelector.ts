import { CartStore } from '../../store/cartStore';
import { productList } from '../../store/constants/productList';
import { ProductStore } from '../../store/productStore';
import { addEventListener } from '../../utils/eventUtil';

import type { Product } from '../../store/cartStore';

let isEventListenerAdded = false;

export const ProductSelector = () => {
  const { actions: ProductActions } = ProductStore;
  const { actions: CartActions } = CartStore;

  // console.count('render');
  const productListState = ProductActions.getProductList();

  // INFO: "추가" 버튼 클릭 핸들러
  if (!isEventListenerAdded) {
    addEventListener('click', function (event: MouseEvent) {
      // addBtn 클릭인지 확인해야함

      if (!(event.target instanceof HTMLButtonElement) || event.target.id !== 'add-to-cart') return;

      const select = document.getElementById('product-select') as HTMLSelectElement;

      const selectItem = select.value;

      //   prodList에서 id와 같은 필드 찾기
      const targetItem = productListState?.find(function (p) {
        return p.id === selectItem;
      });

      if (targetItem && targetItem.q > 0) {
        const item = document.getElementById(targetItem.id) as HTMLOptionElement;

        if (item) {
          const targetId = item.id;

          const quantity = productList.find(function (p) {
            return p.id === targetId;
          })?.q;

          if (quantity && targetItem.q <= quantity) {
            addCart(targetItem);
          } else {
            alert('재고가 부족합니다.');
          }
        } else {
          addCart(targetItem);
        }

        // calcCart();
        // lastSel = selItem;
      }
    });

    isEventListenerAdded = true;
  }

  function addCart(targetItem: Product) {
    CartActions.addCartItem(targetItem);
    ProductActions.decreaseQ(targetItem.id);
  }

  const render = `
        <select id="product-select" class="border rounded p-2 mr-2" >
        ${
          productListState &&
          productListState.map((product) => {
            const isDisabled = product.q === 0 ? 'disabled' : '';

            return `<option id="${product.id}" value="${product.id}" ${isDisabled}>${product.name} - ${product.val}원</option>`;
          })
        }
        </select>
        <button id="add-to-cart" class="bg-blue-500 text-white px-4 py-2 rounded">추가</button>
    `;

  return { render };
};
