import { productStore } from '../../stores/productStore.js';
import { addEvent } from '../../lib/eventManager.js';
import { Option } from './Option.js';

export const SelectProduct = () => {
  const { productList, lastSelectedProductId } = productStore.getState();

  return `<select id="product-select" class="border rounded p-2 mr-2">
${productList
  .map((product) =>
    Option({
      itemId: product.id,
      itemName: product.name,
      itemPrice: product.price,
      itemQuantity: product.quantity,
      lastSelectedProductId: lastSelectedProductId,
    })
  )
  .join('')}  
</select>
<button id="add-to-cart" class="bg-blue-500 text-white px-4 py-2 rounded">추가</button>`;
};

addEvent('change', '#product-select', () => {
  const $select = document.getElementById('product-select');
  const selectedItem = $select.value;

  productStore.actions.setSelectedProduct(selectedItem);
});

addEvent('click', '#add-to-cart', () => {
  const $select = document.getElementById('product-select');
  const selectedItem = $select.value;

  productStore.actions.addToCart(selectedItem);
});
