import { isOutOfStock, isOutOfStockRange } from './entities/stock/model.js';
import { STOCK } from './shared/lib/stock/config.js';
import { updateSelectedOptions } from './features/product-select/ui.js';
import { DISCOUNT } from './entities/discount/config.js';
import { renderCart } from './features/cart-total/ui.js';

let products,
  selectProductElement,
  addCartButton,
  cartElement,
  totalCartAmountElement,
  stockStatusElement;
let selectedProductId;

const hasClass = (element, className) => element.classList.contains(className);
const getProduct = (productList, id) => productList.find((p) => p.id === id);

const ENABLE_EVENT_THRESHOLD = Object.freeze(0.3);
const LUCKY_EVENT = Object.freeze({
  TIMEOUT_DELAY: 10000,
  INTERVAL_DELAY: 30000,
});
const SUGGEST_EVENT = Object.freeze({
  TIMEOUT_DELAY: 20000,
  INTERVAL_DELAY: 60000,
});

const appendChild = (parentElement, ...children) => {
  children.forEach((child) => parentElement.appendChild(child));
};

const randomEventHoc = ({ callback, timeoutDelay, intervalDelay }) => {
  setTimeout(() => {
    setInterval(() => {
      callback();
    }, intervalDelay);
  }, timeoutDelay);
};

const luckyItemEvent = (selectProductElement, products) => () => {
  const luckyItem = products[Math.floor(Math.random() * products.length)];
  if (
    Math.random() < ENABLE_EVENT_THRESHOLD &&
    luckyItem.quantity > STOCK.EMPTY
  ) {
    luckyItem.price = Math.round(
      luckyItem.price * (1 - DISCOUNT.TWENTY_PERCENT)
    );
    alert(`번개세일! ${luckyItem.name}이(가) 20% 할인 중입니다!`);
    updateSelectedOptions(selectProductElement, products);
  }
};

const suggestItemEvent =
  (selectProductElement, products, selectedProductId) => () => {
    if (selectedProductId) {
      const suggest = products.find(function (product) {
        return product.id !== selectedProductId && !isOutOfStock(product);
      });
      if (suggest) {
        alert(`${suggest.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);
        suggest.price = Math.round(suggest.price * (1 - DISCOUNT.FIVE_PERCENT));
        updateSelectedOptions(selectProductElement, products);
      }
    }
  };

function main() {
  products = [
    { id: 'p1', name: '상품1', price: 10_000, quantity: 50 },
    { id: 'p2', name: '상품2', price: 20_000, quantity: 30 },
    { id: 'p3', name: '상품3', price: 30_000, quantity: 20 },
    { id: 'p4', name: '상품4', price: 15_000, quantity: 0 },
    { id: 'p5', name: '상품5', price: 25_000, quantity: 10 },
  ];

  const root = document.getElementById('app');

  const container = document.createElement('div');
  container.className = 'bg-gray-100 p-8';

  const wrapper = document.createElement('div');
  wrapper.className =
    'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8';

  const title = document.createElement('h1');
  title.className = 'text-2xl font-bold mb-4';
  title.textContent = '장바구니';

  cartElement = document.createElement('div');
  cartElement.id = 'cart-items';

  totalCartAmountElement = document.createElement('div');
  totalCartAmountElement.id = 'cart-total';
  totalCartAmountElement.className = 'text-xl font-bold my-4';

  selectProductElement = document.createElement('select');
  selectProductElement.id = 'product-select';
  selectProductElement.className = 'border rounded p-2 mr-2';

  addCartButton = document.createElement('button');
  addCartButton.id = 'add-to-cart';
  addCartButton.className = 'bg-blue-500 text-white px-4 py-2 rounded';
  addCartButton.textContent = '추가';

  stockStatusElement = document.createElement('div');
  stockStatusElement.id = 'stock-status';
  stockStatusElement.className = 'text-sm text-gray-500 mt-2';

  updateSelectedOptions(selectProductElement, products);

  appendChild(
    wrapper,
    title,
    cartElement,
    totalCartAmountElement,
    selectProductElement,
    addCartButton,
    stockStatusElement
  );
  appendChild(container, wrapper);
  appendChild(root, container);

  renderCart({
    cartItems: cartElement.children,
    products,
    totalCartAmountElement,
    stockStatusElement,
  });

  randomEventHoc({
    callback: luckyItemEvent(selectProductElement, products),
    intervalDelay: LUCKY_EVENT.INTERVAL_DELAY,
    timeoutDelay: Math.random() * LUCKY_EVENT.TIMEOUT_DELAY,
  });

  randomEventHoc({
    callback: suggestItemEvent(
      selectProductElement,
      products,
      selectedProductId
    ),
    intervalDelay: SUGGEST_EVENT.INTERVAL_DELAY,
    timeoutDelay: Math.random() * SUGGEST_EVENT.TIMEOUT_DELAY,
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
        element.querySelector('span').textContent =
          `${product.name} - ${product.price}원 x ${newQty}`;
        product.quantity--;
      } else {
        alert('재고가 부족합니다.');
      }
    } else {
      const element = document.createElement('div');
      element.id = product.id;
      element.className = 'flex justify-between items-center mb-2';
      element.innerHTML = `
      <span>${product.name} - ${product.price}원 x 1</span>
          <div>
            <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${product.id}" data-change="-1">-</button>
            <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${product.id}" data-change="1">+</button>
            <button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="${product.id}">삭제</button>
          </div>
      `;
      cartElement.appendChild(element);
      product.quantity--;
    }
    renderCart({
      cartItems: cartElement.children,
      products,
      totalCartAmountElement,
      stockStatusElement,
    });
    selectedProductId = selectedProductValue;
  }
});

const updateProductQuantity = ({ productElement, product, newQuantity }) => {
  const [productLabel, quantityStr] = productElement
    .querySelector('span')
    .textContent.split('x ');
  const totalQuantity = parseInt(quantityStr) + newQuantity;

  if (
    !isOutOfStockRange(totalQuantity, product.quantity + parseInt(quantityStr))
  ) {
    productElement.querySelector('span').textContent =
      `${productLabel}x ${totalQuantity}`;
    product.quantity -= newQuantity;
  } else if (isOutOfStock(totalQuantity)) {
    productElement.remove();
    product.quantity -= newQuantity;
  } else {
    alert('재고가 부족합니다.');
  }
};

const handleCartEvent = (event, products) => {
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
    product.quantity += parseInt(
      productElement.querySelector('span').textContent.split('x ')[1]
    );
    productElement.remove();
  }
  renderCart({
    cartItems: cartElement.children,
    products,
    totalCartAmountElement,
    stockStatusElement,
  });
};

cartElement.addEventListener('click', (e) => handleCartEvent(e, products));
