import { state } from '../store/globalStore';
import calcCart from '../utils/calcCart';

export const handleAddToCart = (prodSelect) => {
  const prodList = state.get('prodList');
  const selItem = prodSelect.value;
  const itemToAdd = prodList.find((p) => p.id === selItem);

  if (itemToAdd && itemToAdd.volume > 0) {
    const cartDisp = document.getElementById('cart-items');
    let item = document.getElementById(itemToAdd.id);

    if (item) {
      const newQty =
        parseInt(item.querySelector('span').textContent.split('x ')[1]) + 1;
      if (newQty <= itemToAdd.volume) {
        item.querySelector('span').textContent =
          `${itemToAdd.name} - ${itemToAdd.price}원 x ${newQty}`;
        itemToAdd.volume--;
      } else {
        alert('재고가 부족합니다.');
      }
    } else {
      const newItem = document.createElement('div');
      newItem.id = itemToAdd.id;
      newItem.className = 'flex justify-between items-center mb-2';
      newItem.innerHTML = `
        <span>${itemToAdd.name} - ${itemToAdd.price}원 x 1</span>
        <div>
          <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${itemToAdd.id}" data-change="-1">-</button>
          <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${itemToAdd.id}" data-change="1">+</button>
          <button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="${itemToAdd.id}">삭제</button>
        </div>`;
      cartDisp.appendChild(newItem);
      itemToAdd.volume--;
    }
    calcCart();
    state.set('lastSel', selItem);
  }
};

export const handleCartActions = (event) => {
  const target = event.target;
  const prodList = state.get('prodList');

  if (
    target.classList.contains('quantity-change') ||
    target.classList.contains('remove-item')
  ) {
    const prodId = target.dataset.productId;
    const itemElem = document.getElementById(prodId);
    const prod = prodList.find((p) => p.id === prodId);

    if (target.classList.contains('quantity-change')) {
      const qtyChange = parseInt(target.dataset.change, 10);
      const newQty =
        parseInt(itemElem.querySelector('span').textContent.split('x ')[1]) +
        qtyChange;

      if (
        newQty > 0 &&
        newQty <=
          prod.volume +
            parseInt(itemElem.querySelector('span').textContent.split('x ')[1])
      ) {
        itemElem.querySelector('span').textContent =
          `${itemElem.querySelector('span').textContent.split('x ')[0]}x ${newQty}`;
        prod.volume -= qtyChange;
      } else if (newQty <= 0) {
        itemElem.remove();
        prod.volume -= qtyChange;
      } else {
        alert('재고가 부족합니다.');
      }
    } else if (target.classList.contains('remove-item')) {
      const remQty = parseInt(
        itemElem.querySelector('span').textContent.split('x ')[1],
        10
      );
      prod.volume += remQty;
      itemElem.remove();
    }
    calcCart();
  }
};
