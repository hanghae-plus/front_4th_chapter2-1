import { cartStore } from '@/stores/cartStore';
import { createElement } from '@/utils/createElement';

import { calcCart } from '@utils/calcCart';

const CartList = (): HTMLDivElement => {
  const container = createElement('div', {
    id: 'cart-items',
  });

  container.addEventListener('click', (event: Event) => {
    const target = event.target as HTMLElement;

    if (target.classList.contains('quantity-change') || target.classList.contains('remove-item')) {
      const productId = target.dataset.productId;

      if (!productId) return;

      const itemElement = document.getElementById(productId);

      if (!itemElement) return;

      const productList = cartStore.get('productList');
      const product = productList.find((p) => p.id === productId);

      if (!product) return;

      if (target.classList.contains('quantity-change')) {
        const quantityChange = parseInt(target.dataset.change || '0');
        const span = itemElement.querySelector('span');

        if (!span?.textContent) return;

        const currentQuantity = parseInt(span.textContent.split('x ')[1]);
        const newQuantity = currentQuantity + quantityChange;

        if (newQuantity > 0 && newQuantity <= product.stock + currentQuantity) {
          span.textContent = `${product.name} - ${product.price}원 x ${newQuantity}`;

          cartStore.set(
            'productList',
            productList.map((p) =>
              p.id === productId ? { ...p, stock: p.stock - quantityChange } : p
            )
          );
        } else if (newQuantity <= 0) {
          itemElement.remove();

          cartStore.set(
            'productList',
            productList.map((p) =>
              p.id === productId ? { ...p, stock: p.stock - quantityChange } : p
            )
          );
        } else {
          alert('재고가 부족합니다.');
        }
      } else if (target.classList.contains('remove-item')) {
        const span = itemElement.querySelector('span');

        if (!span?.textContent) return;

        const removeQuantity = parseInt(span.textContent.split('x ')[1]);

        cartStore.set(
          'productList',
          productList.map((p) =>
            p.id === productId ? { ...p, stock: p.stock + removeQuantity } : p
          )
        );

        itemElement.remove();
      }
      calcCart();
    }
  });

  return container;
};

export default CartList;
