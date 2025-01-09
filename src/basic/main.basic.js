const PRODUCT_LIST = [
  { id: 'p1', name: '상품1', val: 10000, q: 50 },
  { id: 'p2', name: '상품2', val: 20000, q: 30 },
  { id: 'p3', name: '상품3', val: 30000, q: 20 },
  { id: 'p4', name: '상품4', val: 15000, q: 0 },
  { id: 'p5', name: '상품5', val: 25000, q: 10 },
];

const DISCOUNT_RATES = {
  p1: 0.1,
  p2: 0.15,
  p3: 0.2,
  p4: 0.05,
  p5: 0.25,
};

const createMainContainer = () => `
  <div class="bg-gray-100 p-8">
    <div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
      <h1 class="text-2xl font-bold mb-4">장바구니</h1>
      <div id="cart-items"></div>
      <div id="cart-total" class="text-xl font-bold my-4"></div>
      <select id="product-select" class="border rounded p-2 mr-2">
        ${PRODUCT_LIST.map(
          (item) => `
            <option value="${item.id}" ${item.q === 0 ? 'disabled' : ''}>${
            item.name
          } - ${item.val}원</option>
          `
        ).join('')}
      </select>
      <button id="add-to-cart" class="bg-blue-500 text-white px-4 py-2 rounded">추가</button>
      <div id="stock-status" class="text-sm text-gray-500 mt-2"></div>
    </div>
  </div>
`;

const handleAddCartItem = () => {
  const $productSelect = document.getElementById('product-select');
  const $cartItems = document.getElementById('cart-items');

  const selectedProductId = $productSelect.value;
  const addedProduct = PRODUCT_LIST.find(
    (item) => item.id === selectedProductId
  );

  if (addedProduct && addedProduct.q > 0) {
    const cartItem = document.getElementById(addedProduct.id);

    if (cartItem) {
      const itemQty =
        parseInt(cartItem.querySelector('span').textContent.split('x ')[1]) + 1;
      if (itemQty <= addedProduct.q) {
        const updateText = `${addedProduct.name} - ${addedProduct.val}원 x ${itemQty}`;
        cartItem.querySelector('span').textContent = updateText;

        addedProduct.q--;
        console.log(`수량: ${itemQty}, 남은 재고: ${addedProduct.q}`);
      } else {
        alert('재고가 부족합니다.');
      }
    } else {
      $cartItems.insertAdjacentHTML(
        'beforeend',
        createNewCartItem(addedProduct)
      );
      addedProduct.q--;
    }
  }
  calculateCartItem();
};

const createNewCartItem = (addProduct) => `
  <div id=${addProduct.id} class="flex justify-between items-center mb-2">
    <span>${addProduct.name} - ${addProduct.val}원 x 1</span>
    <div>
      <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${addProduct.id}" data-change="-1">-</button>
      <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${addProduct.id}" data-change="1">+</button>
      <button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="${addProduct.id}">삭제</button>
    </div>
  </div>
`;

const handleCartItemQuantity = (e) => {
  const target = e.target;
  const countButton = target.classList.contains('quantity-change');
  const removeButton = target.classList.contains('remove-item');

  const targetProdctId = target.dataset.productId;
  const targetProdctIdElem = document.getElementById(targetProdctId);
  const currentProduct = PRODUCT_LIST.find(
    (prod) => prod.id === targetProdctId
  );

  const targetChange = parseInt(target.dataset.change);
  const initialQty = parseInt(
    targetProdctIdElem.querySelector('span').textContent.split('x ')[1]
  );
  const changeQty = initialQty + targetChange;

  if (!countButton && !removeButton) return;

  if (countButton) {
    if (changeQty > 0 && changeQty <= currentProduct.q + initialQty) {
      targetProdctIdElem.querySelector('span').textContent =
        targetProdctIdElem.querySelector('span').textContent.split('x ')[0] +
        'x ' +
        changeQty;
      currentProduct.q -= targetChange;
    } else if (changeQty <= 0) {
      targetProdctIdElem.remove();
      currentProduct.q -= targetChange;
    } else {
      alert('재고가 부족합니다.');
    }
  }

  if (removeButton) {
    currentProduct.q += initialQty;
    targetProdctIdElem.remove();
  }

  calculateCartItem();
};

const calculateCartItem = () => {
  let totalAmount = 0;
  let totalAmountDisc = 0;
  let totalQuantity = 0;
  let discountRate = 0;
  const cartItems = document.querySelectorAll('#cart-items > div');
  const cartTotalElem = document.getElementById('cart-total');

  cartItems.forEach((cartItem) => {
    const currentItem = PRODUCT_LIST.find(
      (product) => product.id === cartItem.id
    );
    const qty = parseInt(
      cartItem.querySelector('span').textContent.split('x ')[1]
    );
    const currentItemTotal = currentItem.val * qty;
    const discount = qty > 10 ? DISCOUNT_RATES[currentItem.id] || 0 : 0;

    totalQuantity += qty;
    totalAmount += currentItemTotal;
    totalAmountDisc += currentItemTotal * (1 - discount);
  });

  let itemDiscount = totalAmount - totalAmountDisc;
  let bulkDiscount = totalAmountDisc * 0.25;

  if (totalQuantity >= 30 && bulkDiscount > itemDiscount) {
    totalAmountDisc = totalAmount * (1 - 0.25);
    discountRate = 0.25;
  } else {
    discountRate = (totalAmount - totalAmountDisc) / totalAmount;
  }

  if (new Date().getDay() === 2) {
    totalAmountDisc *= 1 - 0.1;
    discountRate = Math.max(discountRate, 0.1);
  }

  updateStockInfo();
  cartTotalElem.innerHTML = createTotal(totalAmountDisc, discountRate);
};

const createTotal = (totalAmountDisc, discountRate) => `
  총액: ${Math.round(totalAmountDisc)}원${
  discountRate > 0
    ? `<span class="text-green-500 ml-2">(${(discountRate * 100).toFixed(
        1
      )}% 할인 적용)</span>`
    : ``
}<span id=loyalty-points class="text-blue-500 ml-2">(포인트: ${Math.floor(
  totalAmountDisc / 1000
)})</span>
`;

const updateStockInfo = () => {
  const stockStatusElem = document.getElementById('stock-status');
  const infoMessage = PRODUCT_LIST.filter((item) => item.q < 5)
    .map(
      (item) =>
        `${item.name}: ${item.q > 0 ? `재고 부족 (${item.q}개 남음)` : `품절`}`
    )
    .join('\n');
  stockStatusElem.textContent = infoMessage;
};

const init = () => {
  const $addToCartButton = document.getElementById('add-to-cart');
  const $cartItems = document.getElementById('cart-items');

  $addToCartButton.addEventListener('click', handleAddCartItem);
  $cartItems.addEventListener('click', handleCartItemQuantity);
  calculateCartItem();
};

const $root = document.getElementById('app');
$root.innerHTML = createMainContainer();
init();
