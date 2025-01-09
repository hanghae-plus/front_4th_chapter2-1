import { CartItems } from './CartItems';

export const AddToCartButton = ({ productList, cartItems }) => {
  document.getElementById('app').addEventListener('click', (e) => {
    if (e.target.id === 'add-to-cart') {
      const selectedProductId = document.getElementById('product-select').value;
      const addedProduct = productList.find(
        (item) => item.id === selectedProductId
      );

      if (addedProduct && addedProduct.q > 0) {
        const cartItem = document.getElementById(addedProduct.id);
        if (cartItem) {
          const itemQty =
            parseInt(
              cartItem.querySelector('span').textContent.split('x ')[1]
            ) + 1;
          console.log(itemQty);
        } else {
          const newCartItem = {
            id: addedProduct.id,
            name: addedProduct.name,
            val: addedProduct.val,
            q: 1,
          };
          cartItems.add(newCartItem);
          CartItems({ cartItems });
        }
      }
    }
  });
  return `
    <button id="add-to-cart" class="bg-blue-500 text-white px-4 py-2 rounded">추가</button>
  `;
};
