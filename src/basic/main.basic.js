// @ts-check

/* ===== 1. 타입 선언 =============================== */
/**
 * @typedef {object} Product
 * @property {string} id
 * @property {string} name
 * @property {number} price
 * @property {number} stock
 */

/* ===== 2. 변수 선언 =============================== */
/** @type {string} */
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

const 초 = 1000;
const 분 = 초 * 60;
const 시간 = 분 * 60;

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

let recentSale;
let bonusPoints = 0;
let totalAmount = 0;
let itemCount = 0;

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
  updateProductSelectOptions();

  setTimeout(
    () => {
      setInterval(() => {
        const luckyItem = products[Math.floor(Math.random() * products.length)];
        const soldOut = luckyItem.stock === 0;

        const chance = 0.3;
        const discountRatio = 0.2;

        if (Math.random() < chance && !soldOut) {
          luckyItem.price = Math.round(luckyItem.price * (1 - discountRatio));

          updateProductSelectOptions();
          alert(`번개세일! ${luckyItem.name}이(가) 20% 할인 중입니다!`);
        }
      }, 30 * 초);
    },
    Math.random() * 10 * 초,
  );

  setTimeout(
    () => {
      setInterval(() => {
        if (recentSale) {
          const suggest = products.find((product) => product.id !== recentSale && product.stock > 0);
          const discountRatio = 0.5;

          if (suggest) {
            suggest.price = Math.round(suggest.price * (1 - discountRatio));

            updateProductSelectOptions();
            alert(suggest.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!');
          }
        }
      }, 분);
    },
    Math.random() * 20 * 초,
  );

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
            <button class="remove-item rounded bg-red-500 px-2 py-1 text-white" data-product-id="${selectedProduct.id}">
              삭제
            </button>
          </div>
        `;

        $divCartItems.appendChild(newItem);
        selectedProduct.stock--;
      }

      recentSale = selectProductId;
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

const updateProductSelectOptions = () => {
  $selectProduct.innerHTML = '';

  products.forEach((product) => {
    const option = document.createElement('option');
    const soldOut = product.stock === 0;

    option.value = product.id;
    option.textContent = `${product.name} - ${product.price}원`;

    if (soldOut) {
      option.disabled = true;
    }

    $selectProduct.appendChild(option);
  });
};

const calculateCart = () => {
  totalAmount = 0;
  itemCount = 0;

  const cartItems = $divCartItems.children;
  let subTotal = 0;

  [...cartItems].forEach((item) => {
    const currentItem = products.find((product) => product.id === item.id);

    if (!currentItem) return;

    const $spanQuantity = /** @type {HTMLSpanElement} */ (item.querySelector('span'));

    const quantity = parseInt(($spanQuantity.textContent || '').split('x ')[1]);
    const itemTotal = currentItem.price * quantity;
    let discount = 0;

    itemCount += quantity;
    subTotal += itemTotal;

    if (quantity >= 10) {
      switch (currentItem.id) {
        case 'p1':
          discount = 0.1;
          break;
        case 'p2':
          discount = 0.15;
          break;
        case 'p3':
          discount = 0.2;
          break;
        case 'p4':
          discount = 0.05;
          break;
        case 'p5':
          discount = 0.25;
          break;
      }
    }

    totalAmount += itemTotal * (1 - discount);
  });

  let discountRatio = 0;

  if (itemCount >= 30) {
    const bulkDiscount = totalAmount * 0.25;
    const itemDiscount = subTotal - totalAmount;

    if (bulkDiscount > itemDiscount) {
      totalAmount = subTotal * (1 - 0.25);
      discountRatio = 0.25;

      return;
    }

    discountRatio = (subTotal - totalAmount) / subTotal;
    return;
  }

  discountRatio = (subTotal - totalAmount) / subTotal;

  if (isTuesday(new Date())) {
    totalAmount *= 1 - 0.1;
    discountRatio = Math.max(discountRatio, 0.1);
  }

  $divTotalPrice.textContent = '총액: ' + Math.round(totalAmount) + '원';

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
  bonusPoints = Math.floor(totalAmount / 1000);

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

  products.forEach((item) => {
    if (item.stock < 5) {
      message += `${item.name}: ${item.stock > 0 ? `재고 부족 ${item.stock}개 남음` : '품절'}\n`;
    }
  });

  $divStockStatus.textContent = message;
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
