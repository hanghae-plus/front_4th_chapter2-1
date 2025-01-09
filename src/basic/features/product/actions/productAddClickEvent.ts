import { renderAfterDiscount } from '../../../shared/actions/renderAfterDiscount';
import { productList } from '../../../shared/entity/data/productList';
import { NewCartItem } from '../../cart/views/NewCartItem';
import { calculateCartItems } from '../../cart/actions/calculateCartItems';

const productAddClickEvent = () => {
  const AddToCartButton = document.getElementById('add-to-cart');

  AddToCartButton?.addEventListener('click', function () {
    const CartItemsView = document.getElementById('cart-items');
    const SelectView = document.getElementById(
      'product-select',
    ) as HTMLSelectElement;
    if (!CartItemsView || !SelectView) return;
    const selectedItemId = SelectView.value;
    const itemToAdd = productList.find(function (p) {
      return p.id === selectedItemId;
    });
    if (itemToAdd && itemToAdd.quantity > 0) {
      const itemElement = document.getElementById(itemToAdd.id);
      const cartItemInfoSpan = itemElement?.querySelector('span');
      const cartItemSelectedCount =
        cartItemInfoSpan?.textContent?.split('x ')[1];
      if (cartItemSelectedCount) {
        const newQty = parseInt(cartItemSelectedCount) + 1;
        if (newQty <= itemToAdd.quantity) {
          cartItemInfoSpan.textContent =
            itemToAdd.name + ' - ' + itemToAdd.price + '원 x ' + newQty;
          itemToAdd.quantity--;
        } else {
          alert('재고가 부족합니다.');
        }
      } else {
        const newItem = document.createElement('div');
        newItem.id = itemToAdd.id;
        newItem.className = 'flex justify-between items-center mb-2';

        newItem.innerHTML = NewCartItem({ item: itemToAdd });
        CartItemsView.appendChild(newItem);
        itemToAdd.quantity--;
      }
      calculateCartItems(
        {
          cartItems: CartItemsView.children,
          productList,
        },
        renderAfterDiscount,
      );
    }
  });
};

export { productAddClickEvent };
