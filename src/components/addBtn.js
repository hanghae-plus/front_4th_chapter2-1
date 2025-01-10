export function createAddBtn({
  sel,
  prodList,
  cartDisp,
  calcCart,
  stockInfo,
  state,
  sum,
}) {
  const addBtn = document.createElement('button');

  addBtn.id = 'add-to-cart';

  addBtn.className = 'bg-blue-500 text-white px-4 py-2 rounded';

  addBtn.textContent = '추가';

  addBtn.addEventListener('click', function () {
    const selItem = sel.value;
    const itemToAdd = prodList.find(function (p) {
      return p.id === selItem;
    });
    if (itemToAdd && itemToAdd.q > 0) {
      const item = document.getElementById(itemToAdd.id);
      if (item) {
        const newQty =
          parseInt(item.querySelector('span').textContent.split('x ')[1]) + 1;
        if (newQty <= itemToAdd.q) {
          item.querySelector('span').textContent =
            itemToAdd.name + ' - ' + itemToAdd.val + '원 x ' + newQty;
          itemToAdd.q--;
        } else {
          alert('재고가 부족합니다.');
        }
      } else {
        const newItem = document.createElement('div');
        newItem.id = itemToAdd.id;
        newItem.className = 'flex justify-between items-center mb-2';
        newItem.innerHTML =
          '<span>' +
          itemToAdd.name +
          ' - ' +
          itemToAdd.val +
          '원 x 1</span><div>' +
          '<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="' +
          itemToAdd.id +
          '" data-change="-1">-</button>' +
          '<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="' +
          itemToAdd.id +
          '" data-change="1">+</button>' +
          '<button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="' +
          itemToAdd.id +
          '">삭제</button></div>';
        cartDisp.appendChild(newItem);
        itemToAdd.q--;
      }
      calcCart({ sum, cartDisp, prodList, stockInfo });
      state.lastSel = selItem;
    }
  });

  return addBtn;
}
