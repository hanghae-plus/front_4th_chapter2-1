let products,
  productSelect,
  addProductButton,
  cartContainer,
  cartTotalDisplay,
  stockInfo;
let lastSelect,
  bonusPoints = 0,
  cartTotal = 0,
  itemCnt = 0;
function main() {
  products = [
    { id: 'p1', name: '상품1', price: 10000, quantity: 50 },
    { id: 'p2', name: '상품2', price: 20000, quantity: 30 },
    { id: 'p3', name: '상품3', price: 30000, quantity: 20 },
    { id: 'p4', name: '상품4', price: 15000, quantity: 0 },
    { id: 'p5', name: '상품5', price: 25000, quantity: 10 },
  ];
  const $root = document.getElementById('app');
  const conatiner = document.createElement('div');
  const section = document.createElement('div');
  const title = document.createElement('h1');
  cartContainer = document.createElement('div');
  cartTotalDisplay = document.createElement('div');
  productSelect = document.createElement('select');
  addProductButton = document.createElement('button');
  stockInfo = document.createElement('div');
  cartContainer.id = 'cart-items';
  cartTotalDisplay.id = 'cart-total';
  productSelect.id = 'product-select';
  addProductButton.id = 'add-to-cart';
  stockInfo.id = 'stock-status';
  conatiner.className = 'bg-gray-100 p-8';
  section.className =
    'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8';
  title.className = 'text-2xl font-bold mb-4';
  cartTotalDisplay.className = 'text-xl font-bold my-4';
  productSelect.className = 'border rounded p-2 mr-2';
  addProductButton.className = 'bg-blue-500 text-white px-4 py-2 rounded';
  stockInfo.className = 'text-sm text-gray-500 mt-2';
  title.textContent = '장바구니';
  addProductButton.textContent = '추가';
  updateProductPrice();
  section.appendChild(title);
  section.appendChild(cartContainer);
  section.appendChild(cartTotalDisplay);
  section.appendChild(productSelect);
  section.appendChild(addProductButton);
  section.appendChild(stockInfo);
  conatiner.appendChild(section);
  $root.appendChild(conatiner);
  calcCart();
  setTimeout(function () {
    setInterval(function () {
      const luckyItem = products[Math.floor(Math.random() * products.length)];
      if (Math.random() < 0.8 && luckyItem.quantity > 0) {
        luckyItem.price = Math.round(luckyItem.price * 0.3);
        alert('번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!');
        updateProductPrice();
      }
    }, 30000);
  }, Math.random() * 10000);
  setTimeout(function () {
    setInterval(function () {
      if (lastSelect) {
        const recommendedProduct = products.find(function (item) {
          return item.id !== lastSelect && item.quantity > 0;
        });
        if (recommendedProduct) {
          alert(
            recommendedProduct.name +
              '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!',
          );
          recommendedProduct.price = Math.round(
            recommendedProduct.price * 0.95,
          );
          updateProductPrice();
        }
      }
    }, 60000);
  }, Math.random() * 20000);
}
function updateProductPrice() {
  productSelect.innerHTML = '';
  products.forEach(function (product) {
    const updateOption = document.createElement('option');
    updateOption.value = product.id;
    updateOption.textContent = product.name + ' - ' + product.price + '원';
    if (product.quantity === 0) updateOption.disabled = true;
    productSelect.appendChild(updateOption);
  });
}
function calcCart() {
  cartTotal = 0; // 할인 적용된 가격
  itemCnt = 0;
  const cartItems = cartContainer.children;
  let originalTotal = 0;
  for (let i = 0; i < cartItems.length; i++) {
    (function () {
      let currentItem;
      for (let j = 0; j < products.length; j++) {
        if (products[j].id === cartItems[i].id) {
          currentItem = products[j];
          break;
        }
      }
      const currentItemQuantity = parseInt(
        cartItems[i].querySelector('span').textContent.split('x ')[1],
      );
      const currentItemTotal = currentItem.price * currentItemQuantity;
      let discountRate = 0;
      itemCnt += currentItemQuantity;
      originalTotal += currentItemTotal; // 정가
      if (currentItemQuantity >= 10) {
        if (currentItem.id === 'p1') discountRate = 0.1;
        else if (currentItem.id === 'p2') discountRate = 0.15;
        else if (currentItem.id === 'p3') discountRate = 0.2;
        else if (currentItem.id === 'p4') discountRate = 0.05;
        else if (currentItem.id === 'p5') discountRate = 0.25;
      }
      cartTotal += currentItemTotal * (1 - discountRate);
    })();
  }

  const BULK_DISCOUNT_RATE = 0.25;
  let discountRate = 0;
  if (itemCnt >= 30) {
    let bulkDiscount = cartTotal * BULK_DISCOUNT_RATE; // 대량 구매 할인 총액
    let itemDiscount = originalTotal - cartTotal; // 아이템 할인 총액
    if (bulkDiscount > itemDiscount) {
      cartTotal = originalTotal * (1 - BULK_DISCOUNT_RATE);
      discountRate = BULK_DISCOUNT_RATE;
    } else {
      discountRate = (originalTotal - cartTotal) / originalTotal;
    }
  } else {
    discountRate = (originalTotal - cartTotal) / originalTotal;
  }

  const TUESDAY_DISCOUNT_RATE = 0.1;
  if (new Date().getDay() === 2) {
    cartTotal *= 1 - TUESDAY_DISCOUNT_RATE;
    discountRate = Math.max(discountRate, TUESDAY_DISCOUNT_RATE);
  }

  cartTotalDisplay.textContent = '총액: ' + Math.round(cartTotal) + '원';
  if (discountRate > 0) {
    const discountRateSpan = document.createElement('span');
    discountRateSpan.className = 'text-green-500 ml-2';
    discountRateSpan.textContent =
      '(' + (discountRate * 100).toFixed(1) + '% 할인 적용)';
    cartTotalDisplay.appendChild(discountRateSpan);
  }
  updateStockInfo();
  renderBonusPoints();
}
const renderBonusPoints = () => {
  bonusPoints = Math.floor(cartTotal / 1000);
  let $points = document.getElementById('loyalty-points');
  if (!$points) {
    $points = document.createElement('span');
    $points.id = 'loyalty-points';
    $points.className = 'text-blue-500 ml-2';
    cartTotalDisplay.appendChild($points);
  }
  $points.textContent = '(포인트: ' + bonusPoints + ')';
};
function updateStockInfo() {
  let infoMsg = '';
  products.forEach(function (product) {
    if (product.quantity < 5) {
      infoMsg +=
        product.name +
        ': ' +
        (product.quantity > 0
          ? '재고 부족 (' + product.quantity + '개 남음)'
          : '품절') +
        '\n';
    }
  });
  stockInfo.textContent = infoMsg;
}
main();
addProductButton.addEventListener('click', function () {
  const selectedId = productSelect.value;
  let selectedProduct = products.find(function (product) {
    return product.id === selectedId;
  });
  if (selectedProduct && selectedProduct.quantity > 0) {
    const $selectedProduct = document.getElementById(selectedProduct.id);
    if ($selectedProduct) {
      const updatedQuantity =
        parseInt(
          $selectedProduct.querySelector('span').textContent.split('x ')[1],
        ) + 1;
      if (updatedQuantity <= selectedProduct.quantity) {
        $selectedProduct.querySelector('span').textContent =
          selectedProduct.name +
          ' - ' +
          selectedProduct.price +
          '원 x ' +
          updatedQuantity;
        selectedProduct.quantity--;
      } else {
        alert('재고가 부족합니다.');
      }
    } else {
      const newCartItem = document.createElement('div');
      newCartItem.id = selectedProduct.id;
      newCartItem.className = 'flex justify-between items-center mb-2';
      newCartItem.innerHTML =
        '<span>' +
        selectedProduct.name +
        ' - ' +
        selectedProduct.price +
        '원 x 1</span><div>' +
        '<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="' +
        selectedProduct.id +
        '" data-change="-1">-</button>' +
        '<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="' +
        selectedProduct.id +
        '" data-change="1">+</button>' +
        '<button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="' +
        selectedProduct.id +
        '">삭제</button></div>';
      cartContainer.appendChild(newCartItem);
      selectedProduct.quantity--;
    }
    calcCart();
    lastSelect = selectedId;
  }
});
cartContainer.addEventListener('click', function (event) {
  const target = event.target;
  if (
    target.classList.contains('quantity-change') ||
    target.classList.contains('remove-item')
  ) {
    const productId = target.dataset.productId;
    const $selectedProduct = document.getElementById(productId);
    const selectedProduct = products.find(function (product) {
      return product.id === productId;
    });
    if (target.classList.contains('quantity-change')) {
      const quantityChange = parseInt(target.dataset.change);
      const updatedQuantity =
        parseInt(
          $selectedProduct.querySelector('span').textContent.split('x ')[1],
        ) + quantityChange;
      if (
        updatedQuantity > 0 &&
        updatedQuantity <=
          selectedProduct.quantity +
            parseInt(
              $selectedProduct.querySelector('span').textContent.split('x ')[1],
            )
      ) {
        $selectedProduct.querySelector('span').textContent =
          $selectedProduct.querySelector('span').textContent.split('x ')[0] +
          'x ' +
          updatedQuantity;
        selectedProduct.quantity -= quantityChange;
      } else if (updatedQuantity <= 0) {
        $selectedProduct.remove();
        selectedProduct.quantity -= quantityChange;
      } else {
        alert('재고가 부족합니다.');
      }
    } else if (target.classList.contains('remove-item')) {
      const removeQuantity = parseInt(
        $selectedProduct.querySelector('span').textContent.split('x ')[1],
      );
      selectedProduct.quantity += removeQuantity;
      $selectedProduct.remove();
    }
    calcCart();
  }
});
