import { products } from './data/products';
import { DISCOUNT_POLICY, STOCK_POLICY, TIMER_POLICY } from './features/cart/constants/policy';
import { applyDiscount } from './features/cart/utils/discount';
import CartStore from './stores/cart.store';
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

const getDecreaseButtonElement = (id) =>
  document.querySelector(`button[data-product-id="${id}"][data-product-event-type="decrease"]`);
const getIncreaseButtonElement = (id) =>
  document.querySelector(`button[data-product-id="${id}"][data-product-event-type="increase"]`);
const getRemoveButtonElement = (id) =>
  document.querySelector(`button[data-product-id="${id}"][data-product-event-type="remove"]`);

const main = (callbackFn) => {
  const root = document.getElementById('app');
  root.innerHTML = /* html */ `
    <div class="bg-gray-100 p-8">
      <div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
        <h1 class="text-2xl font-bold mb-4">장바구니</h1>
        <div id="${ELEMENT_IDS.CART_ITEMS}"></div>
        <div id="${ELEMENT_IDS.CART_TOTAL}" class="text-xl font-bold my-4"></div>
        <select id="${ELEMENT_IDS.PRODUCT_SELECT}" class="border rounded p-2 mr-2" ></select>
        <button id="${ELEMENT_IDS.ADD_TO_CART}" class="bg-blue-500 text-white px-4 py-2 rounded">추가</button>
        <div id="${ELEMENT_IDS.STOCK_STATUS}" class="text-sm text-gray-500 mt-2"></div>
      </div>
    </div>
  `;

  window.productStore = ProductStore.createInstance();
  window.cartStore = CartStore.createInstance();

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
  const cartItems = cartStore.getCartItems();
  const subTotal = cartStore.getAmount();
  let finalAmount = subTotal;
  let totalDiscountRate = 0;

  // 각 상품별 할인 계산
  finalAmount = cartItems.reduce((total, item) => {
    const itemAmount = item.price * item.quantity;
    let discountRate = 0;

    if (item.quantity >= DISCOUNT_POLICY.MIN_QUANTITY_FOR_DISCOUNT) {
      discountRate = DISCOUNT_POLICY.PRODUCT_DISCOUNT_RATES[item.id] || 0;
    }

    return total + applyDiscount({ amount: itemAmount, discountRate });
  }, 0);

  const totalItemCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  // 대량 구매 할인 계산
  if (totalItemCount >= DISCOUNT_POLICY.BULK_PURCHASE_THRESHOLD) {
    const bulkDiscount = applyDiscount({
      amount: subTotal,
      discountRate: DISCOUNT_POLICY.BULK_DISCOUNT_RATE,
    });

    const itemDiscount = subTotal - finalAmount;
    if (bulkDiscount > itemDiscount) {
      finalAmount = bulkDiscount;
      totalDiscountRate = DISCOUNT_POLICY.BULK_DISCOUNT_RATE;
    } else {
      totalDiscountRate = (subTotal - finalAmount) / subTotal;
    }
  } else {
    totalDiscountRate = (subTotal - finalAmount) / subTotal;
  }

  // 화요일 할인 계산
  if (new Date().getDay() === 2) {
    finalAmount = applyDiscount({
      amount: finalAmount,
      discountRate: DISCOUNT_POLICY.WEEKLY_DISCOUNT_RATES.tuesday,
    });
    totalDiscountRate = Math.max(totalDiscountRate, DISCOUNT_POLICY.WEEKLY_DISCOUNT_RATES.tuesday);
  }

  // store 상태 업데이트
  productStore.setAmount(finalAmount);
  productStore.setItemCount(totalItemCount);

  // UI 업데이트
  renderCartTotal(finalAmount, totalDiscountRate);
  renderStockStatus();
  renderPoint();
};

const renderCartTotal = (amount, discountRate) => {
  const cartTotal = getCartTotalElement();
  cartTotal.textContent = `총액: ${Math.round(amount)}원`;

  if (discountRate > 0) {
    cartTotal.insertAdjacentHTML(
      'beforeend',
      /* html */ `
      <span class="text-green-500 ml-2">(${(discountRate * 100).toFixed(1)}% 할인 적용)</span>
      `,
    );
  }
};

const renderPoint = () => {
  productStore.setPoint(Math.floor(productStore.getAmount() / 1000));

  if (!getPointElement()) {
    getCartTotalElement().insertAdjacentHTML(
      'beforeend',
      /* html */ `
      <span id="${ELEMENT_IDS.POINT}" class="text-blue-500 ml-2"></span>
    `.trim(),
    );
  }

  getPointElement().textContent = `(포인트: ${productStore.getPoint()})`;
};

const renderStockStatus = () => {
  getStockStatusElement().innerHTML = products
    .map((product) => {
      const cartItem = cartStore.getCartItem(product.id);
      if (!cartItem) {
        return product.quantity < STOCK_POLICY.STOCK_THRESHOLD
          ? `${product.name}: ${product.quantity > 0 ? `재고 부족 (${product.quantity}개 남음)` : '품절'}`
          : '';
      }

      const remainingQuantity = product.quantity - cartItem.getQuantity();

      return remainingQuantity < STOCK_POLICY.STOCK_THRESHOLD
        ? `${product.name}: ${remainingQuantity > 0 ? `재고 부족 (${remainingQuantity}개 남음)` : '품절'}`
        : '';
    })
    .filter((text) => text !== '')
    .join('\n');
};

const setupLightningSaleTimer = () => {
  setTimeout(() => {
    setInterval(handleLightningSale, TIMER_POLICY.LIGHTNING_SALE_RATE_INTERVAL);
  }, Math.random() * 10000);
};

const handleLightningSale = () => {
  const luckyItem = products[Math.floor(Math.random() * products.length)];
  if (Math.random() < DISCOUNT_POLICY.LIGHTNING_SALE_RATE_PROBABILITY && luckyItem.quantity > 0) {
    luckyItem.price = Math.round(luckyItem.price * (1 - DISCOUNT_POLICY.LIGHTNING_SALE_RATE));
    alert(`번개세일! ${luckyItem.name}이(가) 20% 할인 중입니다!`);
    updateProductList();
  }
};

main(() => {
  updateProductList();
  calcCart();
  setupLightningSaleTimer();
  setTimeout(() => {
    setInterval(() => {
      if (productStore.getLastSelectedProduct()) {
        const suggest = products.find((item) => item.id !== productStore.getLastSelectedProduct() && item.quantity > 0);
        if (suggest) {
          alert(suggest.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!');
          suggest.price = Math.round(suggest.price * (1 - DISCOUNT_POLICY.RECOMMENDATION_DISCOUNT_RATE));
          updateProductList();
        }
      }
    }, TIMER_POLICY.PRODUCT_RECOMMENDATION_INTERVAL);
  }, Math.random() * 20000);

  const handleAddToCart = () => {
    const selectedProductId = getProductSelectElement().value;
    const selectedProductModel = products.find(({ id }) => id === selectedProductId);
    let cartItem = cartStore.getCartItem(selectedProductId);

    if (!canUpdateQuantity(selectedProductModel, cartItem)) {
      alert('재고가 부족합니다.');
      return;
    }

    cartStore.addCartItem(selectedProductModel);
    cartItem = cartStore.getCartItem(selectedProductId);

    const productItemElement = getProductItemElement(cartItem.id);

    if (productItemElement) {
      updateCartItemText(cartItem.id, cartItem);
    } else {
      getCartItemsElement().insertAdjacentHTML('beforeend', renderCartItem(cartItem));
      setupCartItemEvents(cartItem.id, selectedProductModel);
    }

    calcCart();
    productStore.setLastSelectedProduct(selectedProductId);
  };

  getAddCartButtonElement().addEventListener('click', handleAddToCart);

  const renderCartItem = (cartItem) => /* html */ `
  <div id="${cartItem.id}" class="flex justify-between items-center mb-2">
    <span>${cartItem.name} - ${cartItem.price}원 x ${cartItem.getQuantity()}</span>
    <div>
      <button 
        class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" 
        data-product-id="${cartItem.id}" 
        data-product-event-type="decrease"
        data-change="-1"
      >-</button>
      
      <button 
        class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" 
        data-product-id="${cartItem.id}" 
        data-product-event-type="increase"
        data-change="1"
      >+</button>

      <button 
        class="remove-item bg-red-500 text-white px-2 py-1 rounded" 
        data-product-id="${cartItem.id}"
        data-product-event-type="remove"
      >삭제</button>
    </div>
  </div>
`;

  const setupCartItemEvents = (productId, productModel) => {
    getDecreaseButtonElement(productId).addEventListener('click', () => handleDecreaseQuantity(productId));

    getIncreaseButtonElement(productId).addEventListener('click', () =>
      handleIncreaseQuantity(productId, productModel),
    );

    getRemoveButtonElement(productId).addEventListener('click', () => handleRemoveItem(productId));
  };

  const handleDecreaseQuantity = (productId) => {
    cartStore.removeCartItem(productId);
    const cartItem = cartStore.getCartItem(productId);

    if (cartItem?.getQuantity() === 0) {
      getProductItemElement(productId)?.remove();
    } else {
      updateCartItemText(productId, cartItem);
    }
    calcCart();
  };

  const handleIncreaseQuantity = (productId, productModel) => {
    const currentCartItem = cartStore.getCartItem(productId);

    if (!canUpdateQuantity(productModel, currentCartItem)) {
      alert('재고가 부족합니다.');
      return;
    }

    cartStore.addCartItem(productModel);
    updateCartItemText(productId, cartStore.getCartItem(productId));
    calcCart();
  };

  const handleRemoveItem = (productId) => {
    getProductItemElement(productId)?.remove();
    cartStore.deleteCartItem(productId);
    calcCart();
  };
});

const canUpdateQuantity = (productModel, cartItem) => productModel.quantity > (cartItem?.getQuantity() || 0);

const formatCartItemText = (item) => `${item.name} - ${item.price}원 x ${item.getQuantity()}`;

const updateCartItemText = (productId, cartItem) => {
  getProductItemElement(productId).querySelector('span').textContent = formatCartItemText(cartItem);
};
