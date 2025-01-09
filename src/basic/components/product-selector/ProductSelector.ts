import { CartStore } from '../../store/cartStore';
import { productList } from '../../store/constants/productList';
import { ProductStore } from '../../store/productStore';
import { addEventListener } from '../../utils/eventUtil';
import { isQuantityCountOver } from '../hooks/useQuantityChecker';

export const ProductSelector = () => {
  const { actions: ProductActions } = ProductStore;
  const { actions: CartActions } = CartStore;

  let selectedItem = productList[0];

  const productListState = ProductActions.getProductList();
  const cartList = CartActions.getCartList();
  addEventListener('click', (event: Event) => {
    // addBtn 클릭인지 확인해야함

    if (!(event.target instanceof HTMLButtonElement) || event.target.id !== 'add-to-cart') return;

    const matchedCartItem = cartList.find((item) => item.id === selectedItem.id);

    if (matchedCartItem && isQuantityCountOver(selectedItem, matchedCartItem.quantity, productListState)) {
      return;
    }

    const productItem = productListState.find((item) => item.id === selectedItem.id);

    if (productItem) {
      CartActions.addCartItem(productItem);
      ProductActions.decreaseQuantity(selectedItem.id);
    }
  });

  addEventListener('change', (event: Event) => {
    // addBtn 클릭인지 확인해야함

    if (!(event.target instanceof HTMLSelectElement) || event.target.id !== 'product-select') return;

    const selectedId = event.target.value;

    const targetItem = productListState.find((product) => product.id === selectedId);

    if (!targetItem) return;

    selectedItem = targetItem;
  });

  const render = `
        <select id="product-select" class="border rounded p-2 mr-2" >
        ${
          productListState &&
          productListState.map((product) => {
            const isDisabled = product.quantity === 0 ? 'disabled' : '';

            return `<option id="${product.id}" value="${product.id}" ${isDisabled}>${product.name} - ${product.price}원</option>`;
          })
        }
        </select>
        <button id="add-to-cart" class="bg-blue-500 text-white px-4 py-2 rounded">추가</button>
    `;

  return { render };
};
