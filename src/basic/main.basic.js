let products,
  productSelector,
  addToCartButton,
  cartDisplay,
  totalDisplay,
  stockInfo,
  lastSelectedItem;
let bonusPoints = 0,
  totalAmount = 0,
  itemCount = 0;

function main() {
  products = [
    { id: 'p1', name: '상품1', price: 10000, quantity: 50 },
    { id: 'p2', name: '상품2', price: 20000, quantity: 30 },
    { id: 'p3', name: '상품3', price: 30000, quantity: 20 },
    { id: 'p4', name: '상품4', price: 15000, quantity: 0 },
    { id: 'p5', name: '상품5', price: 25000, quantity: 10 },
  ];

  const root = document.getElementById('app');
  const containerDiv = document.createElement('div');
  const contentWrapper = document.createElement('div');
  const mainHeader = document.createElement('h1');

  cartDisplay = document.createElement('div');
  totalDisplay = document.createElement('div');
  productSelector = document.createElement('select');
  addToCartButton = document.createElement('button');
  stockInfo = document.createElement('div');

  cartDisplay.id = 'cart-items';
  totalDisplay.id = 'cart-total';
  productSelector.id = 'product-select';
  addToCartButton.id = 'add-to-cart';
  stockInfo.id = 'stock-status';

  containerDiv.className = 'bg-gray-100 p-8';
  contentWrapper.className =
    'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8';
  mainHeader.className = 'text-2xl font-bold mb-4';
  totalDisplay.className = 'text-xl font-bold my-4';
  productSelector.className = 'border rounded p-2 mr-2';
  addToCartButton.className = 'bg-blue-500 text-white px-4 py-2 rounded';
  stockInfo.className = 'text-sm text-gray-500 mt-2';

  mainHeader.textContent = '장바구니';
  addToCartButton.textContent = '추가';

  updateSelectOptions();

  contentWrapper.appendChild(mainHeader);
  contentWrapper.appendChild(cartDisplay);
  contentWrapper.appendChild(totalDisplay);
  contentWrapper.appendChild(productSelector);
  contentWrapper.appendChild(addToCartButton);
  contentWrapper.appendChild(stockInfo);
  containerDiv.appendChild(contentWrapper);
  root.appendChild(containerDiv);

  calculateCart();

  setTimeout(function () {
    setInterval(function () {
      const luckyItem = products[Math.floor(Math.random() * products.length)];

      if (Math.random() < 0.3 && luckyItem.quantity > 0) {
        luckyItem.price = Math.round(luckyItem.price * 0.8);
        alert('번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!');
        updateSelectOptions();
      }
    }, 30000);
  }, Math.random() * 10000);

  setTimeout(function () {
    setInterval(function () {
      if (lastSelectedItem) {
        const suggest = products.find(function (item) {
          return item.id !== lastSelectedItem && item.quantity > 0;
        });

        if (suggest) {
          alert(
            suggest.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!',
          );
          suggest.price = Math.round(suggest.price * 0.95);
          updateSelectOptions();
        }
      }
    }, 60000);
  }, Math.random() * 20000);
}

function updateSelectOptions() {
  productSelector.innerHTML = '';
  products.forEach(function (item) {
    const selectOption = document.createElement('option');

    selectOption.value = item.id;
    selectOption.textContent = item.name + ' - ' + item.price + '원';
    if (item.quantity === 0) selectOption.disabled = true;

    productSelector.appendChild(selectOption);
  });
}

function calculateCart() {
  totalAmount = 0;
  itemCount = 0;
  const cartItems = cartDisplay.children;
  let preDiscountTotal = 0; // 할인 적용 전 총액

  for (let i = 0; i < cartItems.length; i++) {
    (function () {
      let currentProduct;
      for (let j = 0; j < products.length; j++) {
        if (products[j].id === cartItems[i].id) {
          currentProduct = products[j];
          break;
        }
      }

      const quantity = parseInt(
        cartItems[i].querySelector('span').textContent.split('x ')[1],
      );
      const currentProductAmount = currentProduct.price * quantity;

      let discountRate = 0;
      itemCount += quantity;
      preDiscountTotal += currentProductAmount;

      if (quantity >= 10) {
        if (currentProduct.id === 'p1') discountRate = 0.1;
        else if (currentProduct.id === 'p2') discountRate = 0.15;
        else if (currentProduct.id === 'p3') discountRate = 0.2;
        else if (currentProduct.id === 'p4') discountRate = 0.05;
        else if (currentProduct.id === 'p5') discountRate = 0.25;
      }
      totalAmount += currentProductAmount * (1 - discountRate);
    })();
  }

  let overallDiscountRate = 0;
  if (itemCount >= 30) {
    const bulkDiscount = totalAmount * 0.25;
    const itemDiscount = preDiscountTotal - totalAmount;

    if (bulkDiscount > itemDiscount) {
      totalAmount = preDiscountTotal * (1 - 0.25);
      overallDiscountRate = 0.25;
    } else {
      overallDiscountRate = (preDiscountTotal - totalAmount) / preDiscountTotal;
    }
  } else {
    overallDiscountRate = (preDiscountTotal - totalAmount) / preDiscountTotal;
  }

  if (new Date().getDay() === 2) {
    totalAmount *= 1 - 0.1;
    overallDiscountRate = Math.max(overallDiscountRate, 0.1);
  }

  totalDisplay.textContent = '총액: ' + Math.round(totalAmount) + '원';

  if (overallDiscountRate > 0) {
    const discountSpan = document.createElement('span');
    discountSpan.className = 'text-green-500 ml-2';
    discountSpan.textContent =
      '(' + (overallDiscountRate * 100).toFixed(1) + '% 할인 적용)';
    totalDisplay.appendChild(discountSpan);
  }

  updateStockInfo();
  renderBonusPts();
}

const renderBonusPts = () => {
  bonusPoints = Math.floor(totalAmount / 1000);

  let pointsTag = document.getElementById('loyalty-points');
  if (!pointsTag) {
    pointsTag = document.createElement('span');
    pointsTag.id = 'loyalty-points';
    pointsTag.className = 'text-blue-500 ml-2';
    totalDisplay.appendChild(pointsTag);
  }
  pointsTag.textContent = '(포인트: ' + bonusPoints + ')';
};

function updateStockInfo() {
  let infoMessage = '';
  products.forEach(function (product) {
    if (product.quantity < 5) {
      infoMessage +=
        product.name +
        ': ' +
        (product.quantity > 0
          ? '재고 부족 (' + product.quantity + '개 남음)'
          : '품절') +
        '\n';
    }
  });
  stockInfo.textContent = infoMessage;
}

main();

addToCartButton.addEventListener('click', function () {
  const selectedItem = productSelector.value;
  const productToAdd = products.find(function (p) {
    return p.id === selectedItem;
  });

  if (productToAdd && productToAdd.quantity > 0) {
    const product = document.getElementById(productToAdd.id);

    if (product) {
      const newQuantity =
        parseInt(product.querySelector('span').textContent.split('x ')[1]) + 1;

      if (newQuantity <= productToAdd.quantity) {
        product.querySelector('span').textContent =
          productToAdd.name +
          ' - ' +
          productToAdd.price +
          '원 x ' +
          newQuantity;
        productToAdd.quantity--;
      } else {
        alert('재고가 부족합니다.');
      }
    } else {
      const newProduct = document.createElement('div');
      newProduct.id = productToAdd.id;
      newProduct.className = 'flex justify-between items-center mb-2';
      newProduct.innerHTML =
        '<span>' +
        productToAdd.name +
        ' - ' +
        productToAdd.price +
        '원 x 1</span><div>' +
        '<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="' +
        productToAdd.id +
        '" data-change="-1">-</button>' +
        '<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="' +
        productToAdd.id +
        '" data-change="1">+</button>' +
        '<button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="' +
        productToAdd.id +
        '">삭제</button></div>';

      cartDisplay.appendChild(newProduct);
      productToAdd.quantity--;
    }

    calculateCart();
    lastSelectedItem = selectedItem;
  }
});

cartDisplay.addEventListener('click', function (event) {
  const targetElement = event.target;
  if (
    targetElement.classList.contains('quantity-change') ||
    targetElement.classList.contains('remove-item')
  ) {
    const productId = targetElement.dataset.productId;
    const cartProductElement = document.getElementById(productId);
    const selectedProduct = products.find(function (product) {
      return product.id === productId;
    });

    if (targetElement.classList.contains('quantity-change')) {
      const quantityChange = parseInt(targetElement.dataset.change);
      const newQuantity =
        parseInt(
          cartProductElement.querySelector('span').textContent.split('x ')[1],
        ) + quantityChange;

      if (
        newQuantity > 0 &&
        newQuantity <=
          selectedProduct.quantity +
            parseInt(
              cartProductElement
                .querySelector('span')
                .textContent.split('x ')[1],
            )
      ) {
        cartProductElement.querySelector('span').textContent =
          cartProductElement.querySelector('span').textContent.split('x ')[0] +
          'x ' +
          newQuantity;
        selectedProduct.quantity -= quantityChange;
      } else if (newQuantity <= 0) {
        cartProductElement.remove();
        selectedProduct.quantity -= quantityChange;
      } else {
        alert('재고가 부족합니다.');
      }
    } else if (targetElement.classList.contains('remove-item')) {
      const removedQuantity = parseInt(
        cartProductElement.querySelector('span').textContent.split('x ')[1],
      );
      selectedProduct.quantity += removedQuantity;
      cartProductElement.remove();
    }

    calculateCart();
  }
});
