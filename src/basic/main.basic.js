// @ts-check
import { PRODUCT_DISCOUNT_RATIO } from './constants';

/* ===== 1. 타입 선언 =============================== */
/**
 * @typedef {object} Product
 * @property {string} id
 * @property {string} name
 * @property {number} price
 * @property {number} stock
 */

/**
 * @typedef {object} CartItem
 * @property {number} quantity
 */

/* ===== 2. 변수 선언 =============================== */
const template = /* HTML */ `
  <div class="bg-gray-100 p-8">
    <div class="mx-auto max-w-md overflow-hidden rounded-xl bg-white p-8 shadow-md md:max-w-2xl">
      <h1 class="mb-4 text-2xl font-bold">장바구니</h1>
      <div id="cart-items"></div>
      <div id="cart-total" class="my-4 text-xl font-bold"></div>
      <select id="product-select" class="mr-2 rounded border p-2"></select>
      <button id="add-to-cart" class="rounded bg-blue-500 px-4 py-2 text-white">추가</button>
      <div id="stock-status" class="mt-2 text-sm text-gray-500"></div>
    </div>
  </div>
`;

/** @type {Product[]} */
const products = [
  { id: 'p1', name: '상품1', price: 10000, stock: 50 },
  { id: 'p2', name: '상품2', price: 20000, stock: 30 },
  { id: 'p3', name: '상품3', price: 30000, stock: 20 },
  { id: 'p4', name: '상품4', price: 15000, stock: 0 },
  { id: 'p5', name: '상품5', price: 25000, stock: 10 },
];

/** @type {HTMLDivElement} */
let $divCartItems;
/** @type {HTMLDivElement} */
let $divTotalPrice;
/** @type {HTMLSelectElement} */
let $selectProduct;
/** @type {HTMLButtonElement} */
let $buttonAddCart;
/** @type {HTMLDivElement} */
let $divStockStatus;

// /** @type {Map<string, CartItem>} */
// const cart = new Map();

let recentOrder = '';
let itemCount = 0;
let discountedPrice = 0;
let bonusPoints = 0;

/* ===== 3. 비즈니스 로직 ============================= */
function main() {
  const $root = /** @type {HTMLDivElement} */ (document.querySelector('#app'));
  $root.innerHTML = template;

  $divCartItems = /** @type {HTMLDivElement} */ ($root.querySelector('#cart-items'));
  $divTotalPrice = /** @type {HTMLDivElement} */ ($root.querySelector('#cart-total'));
  $selectProduct = /** @type {HTMLSelectElement} */ ($root.querySelector('#product-select'));
  $buttonAddCart = /** @type {HTMLButtonElement} */ ($root.querySelector('#add-to-cart'));
  $divStockStatus = /** @type {HTMLDivElement} */ ($root.querySelector('#stock-status'));

  calculateCart();
  updateSelectProductOptions();

  notifySale();
  suggestProduct();

  $buttonAddCart.addEventListener('click', () => {
    const selectProductId = $selectProduct.value;
    const selectedProduct = products.find((product) => product.id === selectProductId);
    const soldOut = selectedProduct?.stock === 0;

    if (selectedProduct && !soldOut) {
      const item = document.getElementById(selectedProduct.id);

      if (item) {
        const itemContent = /** @type {HTMLSpanElement} */ (item.querySelector('span'));
        const quantity = parseInt((itemContent.textContent || '').split('x ')[1]) + 1;

        if (quantity > selectedProduct.stock) {
          alert('재고가 부족합니다.');
          return;
        }

        itemContent.textContent = `${selectedProduct.name} - ${selectedProduct.price}원 x ${quantity}`;
        selectedProduct.stock--;
      } else {
        let newItem = document.createElement('div');
        newItem.id = selectedProduct.id;
        newItem.className = 'flex justify-between items-center mb-2';
        newItem.innerHTML = /* HTML */ `
          <span>${selectedProduct.name} - ${selectedProduct.price}원 x 1</span>
          <div>
            <button
              class="quantity-change mr-1 rounded bg-blue-500 px-2 py-1 text-white"
              data-product-id="${selectedProduct.id}"
              data-change="-1"
            >
              -
            </button>
            <button
              class="quantity-change mr-1 rounded bg-blue-500 px-2 py-1 text-white"
              data-product-id="${selectedProduct.id}"
              data-change="1"
            >
              +
            </button>
            <button
              class="remove-item rounded bg-red-500 px-2 py-1 text-white"
              data-product-id="${selectedProduct.id}"
            >
              삭제
            </button>
          </div>
        `;

        $divCartItems.appendChild(newItem);
        selectedProduct.stock--;
      }

      recentOrder = selectProductId;
      calculateCart();
    }
  });

  $divCartItems.addEventListener('click', (event) => {
    const target = /** @type {HTMLButtonElement} */ (event.target);

    if (target.classList.contains('quantity-change') || target.classList.contains('remove-item')) {
      const productId = target.dataset.productId || '';
      const product = products.find((product) => product.id === productId);

      const $item = /** @type {HTMLDivElement} */ (document.getElementById(productId));
      const $spanContent = /** @type {HTMLSpanElement} */ ($item.querySelector('span'));

      const price = /** @type {string} */ ($spanContent.textContent).split('x ')[0];
      const quantity = parseInt(/** @type {string} */ ($spanContent.textContent).split('x ')[1]);

      if (!product) return;

      if (target.classList.contains('quantity-change')) {
        const amount = parseInt(/** @type {string} */ (target.dataset.change));

        const updatedQuantity = quantity + amount;

        if (updatedQuantity > 0 && updatedQuantity <= product.stock + quantity) {
          $spanContent.textContent = `${price}x ${updatedQuantity}`;
          product.stock -= amount;

          return;
        }

        if (updatedQuantity <= 0) {
          $item.remove();
          product.stock -= amount;

          return;
        }

        alert('재고가 부족합니다.');
      } else if (target.classList.contains('remove-item')) {
        const removeQuantity = quantity;
        product.stock += removeQuantity;
        $item.remove();
      }

      calculateCart();
    }
  });
}

/** 무작위 지연 시간 이후 세일 정보를 공지하는 로직을 30초 마다 반복 실행 */
const notifySale = () => {
  setTimeout(() => {
    setInterval(() => {
      const luckyProduct = products[Math.floor(Math.random() * products.length)];
      const soldOut = luckyProduct.stock === 0;

      const chance = 0.3;
      const discountRatio = 0.2;

      if (Math.random() < chance && !soldOut) {
        luckyProduct.price = Math.round(luckyProduct.price * (1 - discountRatio));
        alert(`번개세일! ${luckyProduct.name}이(가) 20% 할인 중입니다!`);
      }
    }, 30000);
  }, Math.random() * 10000);
};

/** 무작위 지연 시간 이후 할인 된 상품을 제안하는 로직을 60초 마다 반복 실행 */
const suggestProduct = () => {
  setTimeout(() => {
    setInterval(() => {
      const suggest = getProduct(recentOrder);

      if (!suggest) return;

      const discountRatio = 0.5;
      suggest.price = Math.round(suggest.price * (1 - discountRatio));

      updateSelectProductOptions();
      alert(suggest.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!');
    }, 60000);
  }, Math.random() * 20000);
};

/** 상품 선택 콤보박스의 옵션을 업데이트 */
const updateSelectProductOptions = () => {
  $selectProduct.innerHTML = '';

  products.forEach((product) => {
    const option = document.createElement('option');
    const soldOut = product.stock === 0;

    option.value = product.id;
    option.textContent = `${product.name} - ${product.price}원`;
    option.disabled = soldOut;

    $selectProduct.appendChild(option);
  });
};

const calculateCart = () => {
  itemCount = 0;
  discountedPrice = 0;

  const cartItems = $divCartItems.children;
  let totalPrice = 0;

  [...cartItems].forEach((item) => {
    const product = getProduct(item.id);

    if (!product) return;

    const $spanQuantity = /** @type {HTMLSpanElement} */ (item.querySelector('span'));
    const quantity = parseInt(($spanQuantity.textContent || '').split('x ')[1]);

    let discountRatio = quantity >= 10 ? PRODUCT_DISCOUNT_RATIO[item.id] || 0 : 0;

    const itemPrice = product.price * quantity;

    itemCount += quantity;
    totalPrice += itemPrice;
    discountedPrice += itemPrice * (1 - discountRatio);
  });

  let discountRatio = 0;

  if (itemCount >= 30) {
    const bulkDiscount = discountedPrice * 0.25;
    const itemDiscount = totalPrice - discountedPrice;

    if (bulkDiscount > itemDiscount) {
      discountedPrice = totalPrice * (1 - 0.25);
      discountRatio = 0.25;

      return;
    }

    discountRatio = (totalPrice - discountedPrice) / totalPrice;
  } else {
    discountRatio = (totalPrice - discountedPrice) / totalPrice;
  }

  if (isTuesday(new Date())) {
    discountedPrice *= 1 - 0.1;
    discountRatio = Math.max(discountRatio, 0.1);
  }

  $divTotalPrice.textContent = '총액: ' + Math.round(discountedPrice) + '원';

  if (discountRatio > 0) {
    const $span = document.createElement('span');
    $span.className = 'text-green-500 ml-2';
    $span.textContent = `(${(discountRatio * 100).toFixed(1)}% 할인 적용)`;

    $divTotalPrice.appendChild($span);
  }

  updateStockInfo();
  renderBonusPoints();
};

const renderBonusPoints = () => {
  bonusPoints = Math.floor(discountedPrice / 1000);

  var $spanLoyaltyPoints = document.getElementById('loyalty-points');

  if (!$spanLoyaltyPoints) {
    $spanLoyaltyPoints = document.createElement('span');
    $spanLoyaltyPoints.id = 'loyalty-points';
    $spanLoyaltyPoints.className = 'text-blue-500 ml-2';

    $divTotalPrice.appendChild($spanLoyaltyPoints);
  }

  $spanLoyaltyPoints.textContent = `(포인트: ${bonusPoints})`;
};

const updateStockInfo = () => {
  let message = '';

  products.forEach((product) => {
    if (product.stock < 5) {
      message += `${product.name}: ${product.stock > 0 ? `재고 부족 ${product.stock}개 남음` : '품절'}\n`;
    }
  });

  $divStockStatus.textContent = message;
};

/**
 * @param {string} id
 * @returns {Product | undefined}
 */
const getProduct = (id) => {
  return products.find((product) => product.id === id);
};

/**
 * @param {Date} date
 * @returns {boolean}
 */
const isTuesday = (date) => {
  return date.getDay() === 2;
};

/* ===== 4. 실행 ====================================== */
main();
