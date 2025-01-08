import { renderCartItems } from './CartItems';
import { renderCartTotal } from './CartTotal';
import { lastSelectedProduct } from '../main.basic';
import { renderStockStatus } from '../renders/stockStatus';

export const AddButton = ({ cartItems, productList }) => {
  document.getElementById('app').addEventListener('click', (e) => {
    if (e.target.id === 'add-to-cart') {
      // selected value props로 받기
      const selectedProductId = document.getElementById('product-select').value;
      const selectedProduct = productList.find((product) => {
        return product.id === selectedProductId;
      });
      if (selectedProduct && selectedProduct.stock > 0) {
        const $cartItem = document.getElementById(selectedProduct.id);
        if ($cartItem) {
          const cartItem = [...cartItems].find((item) => {
            return item.id === selectedProduct.id;
          });

          cartItem.quantity += 1;
          selectedProduct.stock--;

          renderCartItems({ cartItems });
        } else {
          const newCartItem = {
            id: selectedProduct.id,
            name: selectedProduct.name,
            price: selectedProduct.price,
            quantity: 1,
          };
          cartItems.add(newCartItem);
          renderCartItems({ cartItems });

          selectedProduct.stock--;
        }
        renderCartTotal({ cartItems });
        renderStockStatus({ productList });
        lastSelectedProduct.id = selectedProductId;
      } else {
        alert('재고가 부족합니다.');
      }
    }
  });

  return `<button id="add-to-cart" class="bg-blue-500 text-white px-4 py-2 rounded">추가</button>`;
};
