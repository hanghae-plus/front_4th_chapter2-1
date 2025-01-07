let products, selectProductElement, addCartButton, cartElement, totalCartAmountElement, stockStatusElement;
let selectedProductId;

const createElement = (tag, options) => {
  const element = document.createElement(tag);
  Object.entries(options).forEach(([key, value]) => {
    element[key] = value;
  });
  return element;
};

const getOrCreateElement = (tag, options) => {
  const { parentElement, id, ...props } = options;
  let element = document.getElementById(id);
  if (!element) {
    element = createElement(tag, { id, ...props });
    parentElement.appendChild(element);
  }
  return element;
};

const POINT_RATIO = 1000;
const getPointRatio = (totalAmt) => Math.floor(totalAmt / POINT_RATIO);
const getPointRatioMessage = (totalAmt) =>
  `(포인트: ${getPointRatio(totalAmt)})`;

const renderBonusPts = (totalAmt, parentElement) => {
  getOrCreateElement('span', {
    parentElement,
    id: 'loyalty-points',
    className: 'text-blue-500 ml-2',
    textContent: getPointRatioMessage(totalAmt),
  });
};

const LOW_STOCK = 5;
const isLowStock = (item) => item.quantity < LOW_STOCK;

const EMPTY_STOCK = 0;
const isOutOfStock = (item) => item.quantity <= EMPTY_STOCK;

const getStockStatusMessage = (item) =>
  isOutOfStock(item) ? '품절' : `재고 부족 (${item.quantity}개 남음)`;

const formatItemStockDisplay = (item) =>
  `${item.name}: ${getStockStatusMessage(item)}\n`;

const updateStockInfo = (prodList) =>
  prodList.filter(isLowStock).map(formatItemStockDisplay).join('');

const initInnerHTML = (element) => {
  element.innerHTML = '';
}
const getOptionsMessage = (product) => `${product.name} - ${product.price}원`;
const updateSelectedOptions = (parentElement, prodList) => {
  initInnerHTML(parentElement);
  prodList.forEach((product) => {
    getOrCreateElement('option', {
      parentElement: parentElement,
      value: product.id,
      textContent: getOptionsMessage(product),
      disabled: isOutOfStock(product),
    });
  });
}

const NO_DISCOUNT = 0;
const FIVE_PERCENT_DISCOUNT = 0.05;
const TEN_PERCENT_DISCOUNT = 0.1;
const FIFTEEN_PERCENT_DISCOUNT = 0.15;
const TWENTY_PERCENT_DISCOUNT = 0.2;
const QUARTER_DISCOUNT = 0.25;
const TUESDAY_NUMBER = 2;
const DISCOUNT_CRITERIA = 10;
const BULK_DISCOUNT_CRITERIA = 30;
const isTuesday = () => new Date().getDay() === TUESDAY_NUMBER;
const discountRateMessage = (discountRate) => `(${(discountRate * 100).toFixed(1)}% 할인 적용)`;
const totalPriceMessage = (totalAmount) => `총액: ${Math.round(totalAmount)}원`;
const getDiscount = (id, condition) => {
  if(!condition) {
    return NO_DISCOUNT;
  }

  switch (id) {
    case 'p1':
      return TEN_PERCENT_DISCOUNT;
    case 'p2':
      return FIFTEEN_PERCENT_DISCOUNT;
    case 'p3':
      return TWENTY_PERCENT_DISCOUNT;
    case 'p4':
      return FIVE_PERCENT_DISCOUNT;
    case 'p5':
      return QUARTER_DISCOUNT;
    default:
      return NO_DISCOUNT;
  }
};

const getDiscountRate = (itemCount, totalAmount, subTotal) => {
  let discountRate = 0;
  if (itemCount >= BULK_DISCOUNT_CRITERIA) {
    const bulkDiscount = totalAmount * QUARTER_DISCOUNT;
    const productDiscount = subTotal - totalAmount;

    if (bulkDiscount > productDiscount) {
      discountRate = QUARTER_DISCOUNT;
    } else {
      discountRate = (subTotal - totalAmount) / subTotal;
    }
  } else {
    discountRate = (subTotal - totalAmount) / subTotal;
  }

  if (isTuesday()) {
    discountRate = Math.max(discountRate, TEN_PERCENT_DISCOUNT);
  }
  return discountRate;
};

const getTotalAmount = (itemCount, totalAmount, subTotal) => {
  let amount = totalAmount;
  if (itemCount >= BULK_DISCOUNT_CRITERIA) {
    const bulkDiscount = totalAmount * QUARTER_DISCOUNT;
    const productDiscount = subTotal - totalAmount;

    if(bulkDiscount > productDiscount) {
      amount = subTotal * (1 - QUARTER_DISCOUNT);
    }
  }
  if(isTuesday()) {
    amount *= 1 - TEN_PERCENT_DISCOUNT;
  }
  return amount;
};

const calculateProductValues = (product, cartItem) => {
  const [, quantityStr] = cartItem.querySelector('span').textContent.split('x ')
  const quantity = parseInt(quantityStr);
  const productAmount = product.price * quantity;
  const discount = getDiscount(product.id, quantity >= DISCOUNT_CRITERIA);

  return { quantity, productAmount, discount };
}

function calcCart() {

  const cartItems = cartElement.children;

  let totalAmount = 0;
  let itemCount = 0;
  let subTotal = 0;

  for (let i = 0; i < cartItems.length; i++) {
    const product = getProduct(products, cartItems[i].id);
    const { quantity, productAmount, discount } = calculateProductValues(product, cartItems[i]);
    itemCount += quantity;
    subTotal += productAmount;
    totalAmount += productAmount * (1 - discount);
  }


  const discountRate = getDiscountRate(itemCount, totalAmount, subTotal);
  totalAmount = getTotalAmount(itemCount, totalAmount, subTotal);

  totalCartAmountElement.textContent = totalPriceMessage(totalAmount);

  if (discountRate > 0) {
    const span = createElement('span', {
      className: 'text-green-500 ml-2',
      textContent: discountRateMessage(discountRate),
    });
    appendChild(totalCartAmountElement,span);
  }

  stockStatusElement.textContent = updateStockInfo(products);
  renderBonusPts(totalAmount, totalCartAmountElement);
}

const appendChild = (parentElement, ...children) => {
  children.forEach((child) => parentElement.appendChild(child));
}

const randomEventHoc = ({callback, timeoutDelay, intervalDelay}) => {
  setTimeout(() => {
    setInterval(() => {
      callback();
    }, intervalDelay);
  }, timeoutDelay);
};

const luckyItemEvent =  (selectProductElement, products) => () => {
  const luckyItem = products[Math.floor(Math.random() * products.length)];
  if (Math.random() < 0.3 && luckyItem.quantity > 0) {
    luckyItem.price = Math.round(luckyItem.price * 0.8);
    alert(`번개세일! ${luckyItem.name}이(가) 20% 할인 중입니다!`);
    updateSelectedOptions(selectProductElement, products);
  }
}

const suggestItemEvent = (selectProductElement, products, selectedProductId) => () => {
  if (selectedProductId) {
    const suggest = products.find(function (product) {
      return product.id !== selectedProductId && !isOutOfStock(product);
    });
    if (suggest) {
      alert(
        `${suggest.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`
      );
      suggest.price = Math.round(suggest.price * 0.95);
      updateSelectedOptions(selectProductElement, products);
    }
  }
}

function main() {
  products = [
    { id: 'p1', name: '상품1', price: 10_000, quantity: 50 },
    { id: 'p2', name: '상품2', price: 20_000, quantity: 30 },
    { id: 'p3', name: '상품3', price: 30_000, quantity: 20 },
    { id: 'p4', name: '상품4', price: 15_000, quantity: 0 },
    { id: 'p5', name: '상품5', price: 25_000, quantity: 10 },
  ];

  const root = document.getElementById('app');

  const container = createElement('div', {
    className: 'bg-gray-100 p-8',
  });

  const wrapper = createElement('div', {
    className: 'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8',
  });


  const title = createElement('h1', {
    className: 'text-2xl font-bold mb-4',
    textContent: '장바구니',
  });


  cartElement = createElement('div', {
    id: 'cart-items',
  })

  totalCartAmountElement = createElement('div', {
    id: 'cart-total',
    className: 'text-xl font-bold my-4',
  });


  selectProductElement = createElement('select', {
    id: 'product-select',
    className: 'border rounded p-2 mr-2',
  });

  addCartButton = createElement('button', {
    id: 'add-to-cart',
    className: 'bg-blue-500 text-white px-4 py-2 rounded',
    textContent: '추가',
  });

  stockStatusElement = createElement('div', {
    id: 'stock-status',
    className: 'text-sm text-gray-500 mt-2',
  });

  updateSelectedOptions(selectProductElement, products);

  appendChild(wrapper, title, cartElement, totalCartAmountElement, selectProductElement, addCartButton, stockStatusElement);
  appendChild(container,wrapper);
  appendChild(root,container);

  calcCart();

  randomEventHoc({
    callback: luckyItemEvent(selectProductElement, products),
    intervalDelay: 30000,
    timeoutDelay: Math.random() * 10000,
  })

  randomEventHoc({
    callback: suggestItemEvent(selectProductElement, products, selectedProductId),
    intervalDelay: 60000,
    timeoutDelay: Math.random() * 20000,
  });
}

main();


addCartButton.addEventListener('click', function () {
  const selectedProductValue = selectProductElement.value;
  const product = getProduct(products, selectedProductValue);

  if (product && product.quantity > 0) {
    const element = document.getElementById(product.id);

    if (element) {
      const newQty =
        parseInt(element.querySelector('span').textContent.split('x ')[1]) + 1;

      if (newQty <= product.quantity) {
        element.querySelector('span').textContent = `${product.name} - ${product.price}원 x ${newQty}`;
        product.quantity--;
      } else {
        alert('재고가 부족합니다.');
      }
    } else {
      const element = getOrCreateElement('div', {
        parentElement: cartElement,
        id: product.id,
        className: 'flex justify-between items-center mb-2',
      });
      element.innerHTML = `
          <span>${product.name} - ${product.price}원 x 1</span>
          <div>
            <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${product.id}" data-change="-1">-</button>
            <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${product.id}" data-change="1">+</button>
            <button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="${product.id}">삭제</button>
          </div>`;
      product.quantity--;

    }
    calcCart();
    selectedProductId = selectedProductValue;
  }
});

const hasClass = (element, className) => element.classList.contains(className);
const getProduct = (productList, id) => productList.find((p) => p.id === id);
const isOutOfStockRange = (newQty, qty) => newQty <= EMPTY_STOCK || newQty > qty;

const updateProductQuantity = ({ productElement, product, newQuantity }) => {
  const [productLabel, quantityStr] = productElement.querySelector('span').textContent.split('x ')
  const totalQuantity = parseInt(quantityStr) + newQuantity;

  if (!isOutOfStockRange(totalQuantity, product.quantity + parseInt(quantityStr))) {
    productElement.querySelector('span').textContent = `${productLabel}x ${totalQuantity}`;
    product.quantity -= newQuantity;
  } else if (isOutOfStock(totalQuantity)) {
    productElement.remove();
    product.quantity -= newQuantity;
  } else {
    alert('재고가 부족합니다.');
  }
};

const handleCartEvent =  (event, products) => {
  const target = event.target;

  if (
    !hasClass(target, 'quantity-change') &&
    !hasClass(target, 'remove-item')
  ) {
    return;
  }

  const productElement = document.getElementById(target.dataset.productId);
  const product = getProduct(products, target.dataset.productId);


  if (hasClass(target, 'quantity-change')) {
    updateProductQuantity({
      productElement,
      product,
      newQuantity: parseInt(target.dataset.change),
    });
  } else {
    product.quantity += parseInt(productElement.querySelector('span').textContent.split('x ')[1]);
    productElement.remove();
  }
  calcCart();
}

cartElement.addEventListener('click',(e) => handleCartEvent(e, products));
