import { CartTemplate } from './components/cart/CartTemplate.js';

let productList;
let lastSelectedItem,
  bonusPoints = 0,
  totalPrice = 0,
  itemCount = 0;

function main() {
  productList = [
    { id: 'p1', name: '상품1', price: 10000, quantity: 50 },
    { id: 'p2', name: '상품2', price: 20000, quantity: 30 },
    { id: 'p3', name: '상품3', price: 30000, quantity: 20 },
    { id: 'p4', name: '상품4', price: 15000, quantity: 0 },
    { id: 'p5', name: '상품5', price: 25000, quantity: 10 },
  ];

  // HTML 생성
  const $root = document.getElementById('app');

  $root.innerHTML = CartTemplate();

  // Select Html 설정
  updateSelectOptions();

  calculateCart();

  setTimeout(function () {
    setInterval(function () {
      const luckyItem = productList[Math.floor(Math.random() * productList.length)];
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
        const suggest = productList.find(function (item) {
          return item.id !== lastSelectedItem && item.quantity > 0;
        });
        if (suggest) {
          alert(suggest.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!');
          suggest.price = Math.round(suggest.price * 0.95);
          updateSelectOptions();
        }
      }
    }, 60000);
  }, Math.random() * 20000);
}

function updateSelectOptions() {
  const $select = document.getElementById('product-select');

  $select.innerHTML = '';
  productList.forEach(function (item) {
    const $option = document.createElement('option');
    $option.value = item.id;
    $option.textContent = item.name + ' - ' + item.price + '원';
    if (item.quantity === 0) $option.disabled = true;
    $select.appendChild($option);
  });
}

function calculateCart() {
  const $itemsInCart = document.getElementById('cart-items');
  const $totalPrice = document.getElementById('cart-total');

  totalPrice = 0;
  itemCount = 0;

  const $cartItemChildren = $itemsInCart.children;
  let totalTemp = 0;

  for (let i = 0; i < $cartItemChildren.length; i++) {
    (function () {
      let currentItem;

      for (let j = 0; j < productList.length; j++) {
        if (productList[j].id === $cartItemChildren[i].id) {
          currentItem = productList[j];
          break;
        }
      }

      const currentItemCount = parseInt(
        $cartItemChildren[i].querySelector('span').textContent.split('x ')[1]
      );
      const itemTotalPrice = currentItem.price * currentItemCount;
      itemCount += currentItemCount;
      totalTemp += itemTotalPrice;

      let discount = 0;
      if (currentItemCount >= 10) {
        if (currentItem.id === 'p1') discount = 0.1;
        else if (currentItem.id === 'p2') discount = 0.15;
        else if (currentItem.id === 'p3') discount = 0.2;
        else if (currentItem.id === 'p4') discount = 0.05;
        else if (currentItem.id === 'p5') discount = 0.25;
      }

      totalPrice += itemTotalPrice * (1 - discount);
    })();
  }

  let discountRate = 0;
  if (itemCount >= 30) {
    const bulkDisc = totalPrice * 0.25;
    const itemDisc = totalTemp - totalPrice;

    if (bulkDisc > itemDisc) {
      totalPrice = totalTemp * (1 - 0.25);
      discountRate = 0.25;
    } else {
      discountRate = (totalTemp - totalPrice) / totalTemp;
    }
  } else {
    discountRate = (totalTemp - totalPrice) / totalTemp;
  }

  if (new Date().getDay() === 2) {
    totalPrice *= 1 - 0.1;
    discountRate = Math.max(discountRate, 0.1);
  }

  $totalPrice.textContent = '총액: ' + Math.round(totalPrice) + '원';

  if (discountRate > 0) {
    // Html 생성 및 추가
    const span = document.createElement('span');
    span.className = 'text-green-500 ml-2';
    span.textContent = '(' + (discountRate * 100).toFixed(1) + '% 할인 적용)';
    $totalPrice.appendChild(span);
  }

  updateStockInfo();
  renderBonusPoints();
}

const renderBonusPoints = () => {
  const $totalPrice = document.getElementById('cart-total');

  bonusPoints = Math.floor(totalPrice / 1000);
  let $pointTag = document.getElementById('loyalty-points');
  if (!$pointTag) {
    // Html 생성 및 추가
    $pointTag = document.createElement('span');
    $pointTag.id = 'loyalty-points';
    $pointTag.className = 'text-blue-500 ml-2';
    $totalPrice.appendChild($pointTag);
  }
  $pointTag.textContent = '(포인트: ' + bonusPoints + ')';
};

function updateStockInfo() {
  const $stockInfo = document.getElementById('stock-status');

  let stockMessage = '';
  productList.forEach(function (item) {
    if (item.quantity < 5) {
      stockMessage +=
        item.name +
        ': ' +
        (item.quantity > 0 ? '재고 부족 (' + item.quantity + '개 남음)' : '품절') +
        '\n';
    }
  });
  $stockInfo.textContent = stockMessage;
}

main();

// Event Listener
const $addButton = document.getElementById('add-to-cart');
$addButton.addEventListener('click', function () {
  const $select = document.getElementById('product-select');

  const selectedItem = $select.value;
  const itemToAdd = productList.find(function (p) {
    return p.id === selectedItem;
  });
  if (itemToAdd && itemToAdd.quantity > 0) {
    const item = document.getElementById(itemToAdd.id);
    if (item) {
      const newQuantity = parseInt(item.querySelector('span').textContent.split('x ')[1]) + 1;
      if (newQuantity <= itemToAdd.quantity) {
        item.querySelector('span').textContent =
          itemToAdd.name + ' - ' + itemToAdd.price + '원 x ' + newQuantity;

        itemToAdd.quantity--;
      } else {
        alert('재고가 부족합니다.');
      }
    } else {
      // Html 생성 및 추가
      const newItem = document.createElement('div');
      newItem.id = itemToAdd.id;
      newItem.className = 'flex justify-between items-center mb-2';
      newItem.innerHTML =
        '<span>' +
        itemToAdd.name +
        ' - ' +
        itemToAdd.price +
        '원 x 1</span><div>' +
        '<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="' +
        itemToAdd.id +
        '" data-change="-1">-</button>' +
        '<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="' +
        itemToAdd.id +
        '" data-change="1">+</button>' +
        '<button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="' +
        itemToAdd.id +
        '">삭제</button></div>';
      $itemsInCart.appendChild(newItem);

      itemToAdd.quantity--;
    }

    calculateCart();

    lastSelectedItem = selectedItem;
  }
});

const $itemsInCart = document.getElementById('cart-items');
$itemsInCart.addEventListener('click', function (event) {
  const target = event.target;
  if (target.classList.contains('quantity-change') || target.classList.contains('remove-item')) {
    const prodId = target.dataset.productId;
    const $item = document.getElementById(prodId);
    const currentProduct = productList.find(function (p) {
      return p.id === prodId;
    });
    if (target.classList.contains('quantity-change')) {
      const quantityChange = parseInt(target.dataset.change);
      const newQuantity =
        parseInt($item.querySelector('span').textContent.split('x ')[1]) + quantityChange;
      if (
        newQuantity > 0 &&
        newQuantity <=
          currentProduct.quantity + parseInt($item.querySelector('span').textContent.split('x ')[1])
      ) {
        currentProduct.quantity -= quantityChange;

        $item.querySelector('span').textContent =
          $item.querySelector('span').textContent.split('x ')[0] + 'x ' + newQuantity;
      } else if (newQuantity <= 0) {
        currentProduct.quantity -= quantityChange;

        $item.remove();
      } else {
        alert('재고가 부족합니다.');
      }
    } else if (target.classList.contains('remove-item')) {
      const removedQuantity = parseInt($item.querySelector('span').textContent.split('x ')[1]);
      currentProduct.quantity += removedQuantity;

      $item.remove();
    }

    calculateCart();
  }
});
