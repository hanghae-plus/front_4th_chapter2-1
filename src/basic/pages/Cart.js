import Point from '../components/Point';
import SelectOption from '../components/SelectOption';
import StockInfo from '../components/StockInfo';
import Total from '../components/Total';
import { state } from '../store/globalStore';
import { createElement } from '../utils/createElement';

function Cart() {
  const root = document.getElementById('app');

  const header = createElement(
    'h1',
    { class: 'text-2xl font-bold mb-4' },
    '장바구니'
  );
  const cartDisp = createElement('div', { id: 'cart-items', class: 'my-4' });
  const cartTotal = createElement('div', {
    id: 'cart-total',
    class: 'text-xl font-bold my-4'
  });
  const stockInfo = createElement('div', {
    id: 'stock-status',
    class: 'text-sm text-gray-500 mt-2'
  });

  const prodSelect = createElement('select', {
    id: 'product-select',
    class: 'border rounded p-2 mr-2'
  });
  const addBtn = createElement(
    'button',
    { id: 'add-to-cart', class: 'bg-blue-500 text-white px-4 py-2 rounded' },
    '추가'
  );

  const wrap = createElement(
    'div',
    {
      class:
        'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8'
    },
    [header, cartDisp, cartTotal, prodSelect, addBtn, stockInfo]
  );

  const container = createElement('div', { class: 'bg-gray-100 p-8' }, wrap);

  root.appendChild(container);

  Total(0, 0);
  Point();
  SelectOption();
  StockInfo();

  addBtn.addEventListener('click', function () {
    const prodList = state.get('prodList');
    let selItem = prodSelect.value;
    let itemToAdd = prodList.find(function (p) {
      return p.id === selItem;
    });
    if (itemToAdd && itemToAdd.volume > 0) {
      let item = document.getElementById(itemToAdd.id);
      if (item) {
        let newQty =
          parseInt(item.querySelector('span').textContent.split('x ')[1]) + 1;
        if (newQty <= itemToAdd.volume) {
          item.querySelector('span').textContent =
            itemToAdd.name + ' - ' + itemToAdd.price + '원 x ' + newQty;
          itemToAdd.volume--;
        } else {
          alert('재고가 부족합니다.');
        }
      } else {
        let newItem = document.createElement('div');
        newItem.id = itemToAdd.id;
        newItem.className = 'flex justify-between items-center mb-2';
        newItem.innerHTML =
          '<span>' +
          itemToAdd.name +
          ' - ' +
          itemToAdd.price +
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
        itemToAdd.volume--;
      }
      calcCart();
      state.set('lastSel', selItem);
    }
  });

  cartDisp.addEventListener('click', function (event) {
    let tgt = event.target;
    let prodList = state.get('prodList');
    if (
      tgt.classList.contains('quantity-change') ||
      tgt.classList.contains('remove-item')
    ) {
      let prodId = tgt.dataset.productId;
      let itemElem = document.getElementById(prodId);
      let prod = prodList.find(function (p) {
        return p.id === prodId;
      });
      if (tgt.classList.contains('quantity-change')) {
        let qtyChange = parseInt(tgt.dataset.change);
        let newQty =
          parseInt(itemElem.querySelector('span').textContent.split('x ')[1]) +
          qtyChange;
        if (
          newQty > 0 &&
          newQty <=
            prod.volume +
              parseInt(
                itemElem.querySelector('span').textContent.split('x ')[1]
              )
        ) {
          itemElem.querySelector('span').textContent =
            itemElem.querySelector('span').textContent.split('x ')[0] +
            'x ' +
            newQty;
          prod.volume -= qtyChange;
        } else if (newQty <= 0) {
          itemElem.remove();
          prod.volume -= qtyChange;
        } else {
          alert('재고가 부족합니다.');
        }
      } else if (tgt.classList.contains('remove-item')) {
        let remQty = parseInt(
          itemElem.querySelector('span').textContent.split('x ')[1]
        );
        console.log(remQty);
        prod.volume += remQty;
        itemElem.remove();
      }
      calcCart();
    }
  });
}

const BULK_AMOUNT = 30;
const BULK_DISCOUNT_RATE = 0.25;
const SPECIAL_DAY = 2;
const SPECIAL_DAY_DISCOUNT_RATE = 0.1;

function calcCart() {
  let totalAmt = 0;
  let itemCnt = 0;

  const cartDisp = document.getElementById('cart-items');

  let totalAmtBeforeDisc = 0;
  let discRate = 0;

  const cartItems = Array.from(cartDisp.children);

  cartItems.forEach((cartItem) => {
    const currentItem = findProductById(cartItem.id);
    if (!currentItem) return;

    const quantity = parseInt(
      cartItem.querySelector('span').textContent.split('x ')[1],
      10
    );
    const itemTotal = currentItem.price * quantity;
    const discountRate = getDiscountRate(currentItem.id, quantity);

    state.set('totalAmt', (totalAmt += itemTotal * (1 - discountRate)));

    totalAmtBeforeDisc += itemTotal;
    state.set('itemCnt', (itemCnt += quantity));
  });

  discRate = applyBulkDiscount(totalAmt, itemCnt, totalAmtBeforeDisc, discRate);
  ({ totalAmt, discRate } = applySpecialdayDiscount(totalAmt, discRate));

  Total(totalAmt, discRate);
  StockInfo();
  Point();
}

const findProductById = (productId) => {
  const prodList = state.get('prodList');
  return prodList.find((product) => product.id === productId);
};

const getDiscountRate = (productId, quantity) => {
  const DISCOUNT_RATES = {
    p1: 0.1,
    p2: 0.15,
    p3: 0.2,
    p4: 0.05,
    p5: 0.25
  };

  if (quantity >= 10 && DISCOUNT_RATES[productId]) {
    return DISCOUNT_RATES[productId];
  }
  return 0;
};

const applyBulkDiscount = (totalAmt, itemCnt, totalAmtBeforeDisc, discRate) => {
  if (totalAmtBeforeDisc === 0) return 0;

  const calDefaultDiscRate = () =>
    (totalAmtBeforeDisc - totalAmt) / totalAmtBeforeDisc;

  if (itemCnt >= BULK_AMOUNT) {
    const bulkDiscountAmount = totalAmtBeforeDisc * BULK_DISCOUNT_RATE;
    const currentDiscountAmount = totalAmtBeforeDisc - totalAmt;

    if (bulkDiscountAmount > currentDiscountAmount) {
      totalAmt = totalAmtBeforeDisc * (1 - BULK_DISCOUNT_RATE);
      return BULK_DISCOUNT_RATE;
    }
  }

  return calDefaultDiscRate();
};

const applySpecialdayDiscount = (totalAmt, discRate) => {
  const today = new Date().getDay();

  if (today === SPECIAL_DAY) {
    totalAmt *= 1 - SPECIAL_DAY_DISCOUNT_RATE;
    discRate = Math.max(discRate, SPECIAL_DAY_DISCOUNT_RATE);
  }

  return { totalAmt, discRate };
};

export default Cart;
