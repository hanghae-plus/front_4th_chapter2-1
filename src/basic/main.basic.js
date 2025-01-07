let products, sel, addBtn, cartDisp, sum, stockInfo;
let lastSel;

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


function calcCart() {

  const cartItems = cartDisp.children;

  let totalAmount = 0;
  let itemCount = 0;
  let subTotal = 0;

  for (let i = 0; i < cartItems.length; i++) {
    (function () {
      const product = getProduct(products, cartItems[i].id);
      const [productName, quantityStr] = cartItems[i].querySelector('span').textContent.split('x ')
      const quantity = parseInt(quantityStr);
      const productAmount = product.price * quantity;
      let disc = 0;
      itemCount += quantity;
      subTotal += productAmount;
      if (quantity >= 10) {
        if (product.id === 'p1') disc = 0.1;
        else if (product.id === 'p2') disc = 0.15;
        else if (product.id === 'p3') disc = 0.2;
        else if (product.id === 'p4') disc = 0.05;
        else if (product.id === 'p5') disc = 0.25;
      }
      totalAmount += productAmount * (1 - disc);
    })();
  }

  let discRate = 0;

  if (itemCount >= 30) {
    const bulkDisc = totalAmount * 0.25;
    const itemDisc = subTotal - totalAmount;

    if (bulkDisc > itemDisc) {
      totalAmount = subTotal * (1 - 0.25);
      discRate = 0.25;
    } else {
      discRate = (subTotal - totalAmount) / subTotal;
    }
  } else {
    discRate = (subTotal - totalAmount) / subTotal;
  }

  // TODO: 외부 주입으로 변경
  if (new Date().getDay() === 2) {
    // TODO: 할인율 매직넘버 제거
    totalAmount *= 1 - 0.1;
    discRate = Math.max(discRate, 0.1);
  }

  sum.textContent = '총액: ' + Math.round(totalAmount) + '원';

  if (discRate > 0) {
    const span = document.createElement('span');
    span.className = 'text-green-500 ml-2';
    span.textContent = '(' + (discRate * 100).toFixed(1) + '% 할인 적용)';
    sum.appendChild(span);
  }

  stockInfo.textContent = updateStockInfo(products);
  renderBonusPts(totalAmount, sum);
}

function main() {
  products = [
    { id: 'p1', name: '상품1', price: 10000, quantity: 50 },
    { id: 'p2', name: '상품2', price: 20000, quantity: 30 },
    { id: 'p3', name: '상품3', price: 30000, quantity: 20 },
    { id: 'p4', name: '상품4', price: 15000, quantity: 0 },
    { id: 'p5', name: '상품5', price: 25000, quantity: 10 },
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

  cartDisp = document.createElement('div');
  cartDisp.id = 'cart-items';

  sum = document.createElement('div');
  sum.id = 'cart-total';
  sum.className = 'text-xl font-bold my-4';

  sel = document.createElement('select');
  sel.id = 'product-select';
  sel.className = 'border rounded p-2 mr-2';

  addBtn = document.createElement('button');
  addBtn.id = 'add-to-cart';
  addBtn.className = 'bg-blue-500 text-white px-4 py-2 rounded';
  addBtn.textContent = '추가';

  stockInfo = document.createElement('div');
  stockInfo.id = 'stock-status';
  stockInfo.className = 'text-sm text-gray-500 mt-2';

  updateSelectedOptions(sel, products);

  wrapper.appendChild(title);
  wrapper.appendChild(cartDisp);
  wrapper.appendChild(sum);
  wrapper.appendChild(sel);
  wrapper.appendChild(addBtn);
  wrapper.appendChild(stockInfo);

  container.appendChild(wrapper);

  root.appendChild(container);

  calcCart();

  setTimeout(function () {
    setInterval(function () {
      const luckyItem = products[Math.floor(Math.random() * products.length)];
      if (Math.random() < 0.3 && luckyItem.quantity > 0) {
        luckyItem.price = Math.round(luckyItem.price * 0.8);
        alert('번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!');
        updateSelectedOptions(sel, products);
      }
    }, 30000);
  }, Math.random() * 10000);

  setTimeout(function () {
    setInterval(function () {
      if (lastSel) {
        const suggest = products.find(function (item) {
          return item.id !== lastSel && item.quantity > 0;
        });
        if (suggest) {
          alert(
            suggest.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!'
          );
          suggest.price = Math.round(suggest.price * 0.95);
          updateSelectedOptions(sel, products);
        }
      }
    }, 60000);
  }, Math.random() * 20000);
}

main();


addBtn.addEventListener('click', function () {
  const selItem = sel.value;
  const product = products.find(function (p) {
    return p.id === selItem;
  });

  if (product && product.quantity > 0) {
    const item = document.getElementById(product.id);

    if (item) {
      const newQty =
        parseInt(item.querySelector('span').textContent.split('x ')[1]) + 1;

      if (newQty <= product.quantity) {
        item.querySelector('span').textContent =
          product.name + ' - ' + product.price + '원 x ' + newQty;
        product.quantity--;
      } else {
        alert('재고가 부족합니다.');
      }
    } else {
      const element = getOrCreateElement('div', {
        parentElement: cartDisp,
        id: product.id,
        className: 'flex justify-between items-center mb-2',
      });
      // TODO: render 함수를 생성하여 적용
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
    lastSel = selItem;
  }
});

const isContainClass = (element, className) => element.classList.contains(className);
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
    !isContainClass(target, 'quantity-change') &&
    !isContainClass(target, 'remove-item')
  ) {
    return;
  }

  const productElement = document.getElementById(target.dataset.productId);
  const product = getProduct(products, target.dataset.productId);


  if (isContainClass(target, 'quantity-change')) {
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

cartDisp.addEventListener('click',(e) => handleCartEvent(e, products));
