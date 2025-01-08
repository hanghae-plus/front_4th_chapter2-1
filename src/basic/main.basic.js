import { products } from './data/products';
import { DISCOUNT_POLICY, STOCK_POLICY, TIMER_POLICY } from './features/cart/constants/policy';
import { applyDiscount } from './features/cart/utils/discount';
import ProductStore from './stores/product.store';

const ELEMENT_IDS = {
  STOCK_STATUS: 'stock-status',
  ADD_TO_CART: 'add-to-cart',
  PRODUCT_SELECT: 'product-select',
  CART_TOTAL: 'cart-total',
  CART_ITEMS: 'cart-items',
  POINT: 'point',
};

const getStockStatusElement = () => document.getElementById(ELEMENT_IDS.STOCK_STATUS);
const getAddCartButtonElement = () => document.getElementById(ELEMENT_IDS.ADD_TO_CART);
const getProductSelectElement = () => document.getElementById(ELEMENT_IDS.PRODUCT_SELECT);
const getCartTotalElement = () => document.getElementById(ELEMENT_IDS.CART_TOTAL);
const getCartItemsElement = () => document.getElementById(ELEMENT_IDS.CART_ITEMS);
const getPointElement = () => document.getElementById(ELEMENT_IDS.POINT);
const getProductItemElement = (id) => document.getElementById(id);

const store = ProductStore.createInstance();

const main = (callbackFn) => {
  const root = document.getElementById('app');
  root.innerHTML = /* html */ `
    <div class="bg-gray-100 p-8">
      <div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
        <h1 class="text-2xl font-bold mb-4">장바구니</h1>
        <div id="${ELEMENT_IDS.CART_ITEMS}"></div>
        <div id="${ELEMENT_IDS.CART_TOTAL}"></div>
        <div id="${ELEMENT_IDS.STOCK_STATUS}" class="text-sm text-gray-500 mt-2"></div>
        <button id="${ELEMENT_IDS.ADD_TO_CART}" class="bg-blue-500 text-white px-4 py-2 rounded">추가</button>
        <select id="${ELEMENT_IDS.PRODUCT_SELECT}" class="border rounded p-2 mr-2" ></select>
      </div>
    </div>
  `;

  callbackFn();
};

const clearProductSelectElementChildren = () => {
  getProductSelectElement().innerHTML = '';
};

const updateProductList = () => {
  clearProductSelectElementChildren();
  products.forEach(({ id, name, price, quantity }) => {
    getProductSelectElement().insertAdjacentHTML(
      'beforeend',
      /* html */ `
      <option value="${id}" ${quantity === 0 ? 'disabled' : null}>${`${name} - ${price}원`}</option>
    `,
    );
  });
};

const calcCart = () => {
  store.setAmount(0);
  store.setItemCount(0);
  const cartItems = getCartItemsElement().children;
  let subTotal = 0;
  for (let i = 0; i < cartItems.length; i++) {
    (() => {
      let currentProduct;
      for (let j = 0; j < products.length; j++) {
        if (products[j].id === cartItems[i].id) {
          currentProduct = products[j];
          break;
        }
      }
      const quantity = parseInt(cartItems[i].querySelector('span').textContent.split('x ')[1]);
      const itemAmount = currentProduct.price * quantity;
      let discountRate = 0;
      store.setItemCount(store.getItemCount() + quantity);
      subTotal += itemAmount;
      if (quantity >= DISCOUNT_POLICY.MIN_QUANTITY_FOR_DISCOUNT) {
        discountRate = DISCOUNT_POLICY.PRODUCT_DISCOUNT_RATES[currentProduct.id] || 0;
      }
      store.setAmount(store.getAmount() + applyDiscount({ amount: itemAmount, discountRate }));
    })();
  }
  let totalDiscountRate = 0;
  if (store.getItemCount() >= DISCOUNT_POLICY.BULK_PURCHASE_THRESHOLD) {
    const bulkDiscount = applyDiscount({
      amount: subTotal,
      discountRate: DISCOUNT_POLICY.BULK_DISCOUNT_RATE,
    });
    const itemDiscount = subTotal - store.getAmount();
    if (bulkDiscount > itemDiscount) {
      store.setAmount(bulkDiscount);
      totalDiscountRate = DISCOUNT_POLICY.BULK_DISCOUNT_RATE;
    } else {
      totalDiscountRate = (subTotal - store.getAmount()) / subTotal;
    }
  } else {
    totalDiscountRate = (subTotal - store.getAmount()) / subTotal;
  }
  if (new Date().getDay() === 2) {
    store.setAmount(
      applyDiscount({
        amount: store.getAmount(),
        discountRate: DISCOUNT_POLICY.WEEKLY_DISCOUNT_RATES.tuesday,
      }),
    );
    totalDiscountRate = Math.max(totalDiscountRate, DISCOUNT_POLICY.WEEKLY_DISCOUNT_RATES.tuesday);
  }

  getCartTotalElement().textContent = '총액: ' + Math.round(store.getAmount()) + '원';

  if (totalDiscountRate > 0) {
    getCartTotalElement().insertAdjacentHTML(
      'beforeend',
      /* html */ `
      <span class="text-green-500 ml-2">(${(totalDiscountRate * 100).toFixed(1)}% 할인 적용)</span>
    `,
    );
  }
  renderStockStatus();
  renderPoints();
};

const renderPoints = () => {
  store.setPoints(Math.floor(store.getAmount() / 1000));

  if (!getPointElement()) {
    getCartTotalElement().insertAdjacentHTML(
      'beforeend',
      /* html */ `
      <span id="${ELEMENT_IDS.POINT}" class="text-blue-500 ml-2"></span>
    `.trim(),
    );
  }

  getPointElement().textContent = `(포인트: ${store.getPoints()})`;
};

const renderStockStatus = () => {
  getStockStatusElement().innerHTML = products
    .filter((item) => item.quantity < STOCK_POLICY.STOCK_THRESHOLD)
    .map(({ name, quantity }) => {
      const message = `${name}: ${quantity > 0 ? `재고 부족 (${quantity}개 남음)` : '품절'}`;
      return /* html */ `<div class="stock-status-item">${message}</div>`;
    })
    .join('');
};

main(() => {
  updateProductList();
  calcCart();
  setTimeout(() => {
    setInterval(() => {
      const luckyItem = products[Math.floor(Math.random() * products.length)];
      if (Math.random() < DISCOUNT_POLICY.LIGHTNING_SALE_RATE_PROBABILITY && luckyItem.quantity > 0) {
        luckyItem.price = Math.round(luckyItem.price * (1 - DISCOUNT_POLICY.LIGHTNING_SALE_RATE));
        alert('번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!');
        updateProductList();
      }
    }, TIMER_POLICY.LIGHTNING_SALE_RATE_INTERVAL);
  }, Math.random() * 10000);
  setTimeout(() => {
    setInterval(() => {
      if (store.getLastSelectedProduct()) {
        const suggest = products.find((item) => item.id !== store.getLastSelectedProduct() && item.quantity > 0);
        if (suggest) {
          alert(suggest.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!');
          suggest.price = Math.round(suggest.price * (1 - DISCOUNT_POLICY.RECOMMENDATION_DISCOUNT_RATE));
          updateProductList();
        }
      }
    }, TIMER_POLICY.PRODUCT_RECOMMENDATION_INTERVAL);
  }, Math.random() * 20000);

  getAddCartButtonElement().addEventListener('click', () => {
    const selectedProductId = getProductSelectElement().value;

    const selectedProduct = products.find(({ id }) => id === selectedProductId);
    if (selectedProduct?.quantity > 0) {
      const productItemElement = getProductItemElement(selectedProduct.id);

      if (productItemElement) {
        const updatedCartItem = productItemElement.querySelector('span');

        const updatedCartItemQuantity = parseInt(updatedCartItem.textContent.split('x ')[1]) + 1;

        if (updatedCartItemQuantity <= selectedProduct.quantity) {
          updatedCartItem.textContent = `${selectedProduct.name} - ${selectedProduct.price}원 x ${updatedCartItemQuantity}`;

          selectedProduct.quantity--;
        } else {
          alert('재고가 부족합니다.');
        }
      } else {
        getCartItemsElement().insertAdjacentHTML(
          'beforeend',
          /* html */ `
          <div id="${selectedProduct.id}" class="flex justify-between items-center mb-2">
            <span>${selectedProduct.name} - ${selectedProduct.price}원 x 1</span>
            <div>
              <button 
                class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" 
                data-product-id="${selectedProduct.id}" 
                data-change="-1"
              >
              -
              </button>
              
              <button 
                class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" 
                data-product-id="${selectedProduct.id}" 
                data-change="1"
              >
              +
              </button>

              <button 
                class="remove-item bg-red-500 text-white px-2 py-1 rounded" 
                data-product-id="${selectedProduct.id}"
              >
              삭제
              </button>
            </div>
          </div>
        `,
        );
        selectedProduct.quantity--;
      }
      calcCart();
      store.setLastSelectedProduct(selectedProductId);
    }
  });

  getCartItemsElement().addEventListener('click', (event) => {
    const eventTarget = event.target;
    if (eventTarget.classList.contains('quantity-change') || eventTarget.classList.contains('remove-item')) {
      const productId = eventTarget.dataset.productId;
      const itemElem = document.getElementById(productId);
      const product = products.find((item) => item.id === productId);
      if (eventTarget.classList.contains('quantity-change')) {
        const qtyChange = parseInt(eventTarget.dataset.change);
        const newQty = parseInt(itemElem.querySelector('span').textContent.split('x ')[1]) + qtyChange;
        if (
          newQty > 0 &&
          newQty <= product.quantity + parseInt(itemElem.querySelector('span').textContent.split('x ')[1])
        ) {
          itemElem.querySelector('span').textContent =
            itemElem.querySelector('span').textContent.split('x ')[0] + 'x ' + newQty;
          product.quantity -= qtyChange;
        } else if (newQty <= 0) {
          itemElem.remove();
          product.quantity -= qtyChange;
        } else {
          alert('재고가 부족합니다.');
        }
      } else if (eventTarget.classList.contains('remove-item')) {
        const remQty = parseInt(itemElem.querySelector('span').textContent.split('x ')[1]);
        product.quantity += remQty;
        itemElem.remove();
      }
      calcCart();
    }
  });
});
