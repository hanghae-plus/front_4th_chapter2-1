import { DiscountedRate } from './const/discount';
import { calculateCart } from './services/calculateCart';
import { updateSelectOptions } from './services/updateSelectOption';

let productList, select, addButton, cartDisplay, sum, stockInfo;

let lastSell,
  bonusPoints = 0;

function main() {
  return (
    <>
      <div id="app"></div>
      <div id="container" className="bg-gray-100 p-8"></div>
      <div
        id="wrap"
        className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8"
      >
        <h1 id="hText" className="text-2xl font-bold mb-4">
          장바구니
        </h1>
        <div id="cart-items"></div>
        <div id="cart-total" className="text-xl font-bold my-4"></div>
        <select id="product-select" className="border rounded p-2 mr-2"></select>
        <button id="add-to-cart" className="bg-blue-500 text-white px-4 py-2 rounded"></button>
        <div id="stock-status" className="text-sm text-gray-500 mt-2"></div>
      </div>
    </>
  );
}

updateSelectOptions();

calculateCart();

// 번개세일 할인 이벤트
setTimeout(function () {
  setInterval(function () {
    const luckyItem = productList[Math.floor(Math.random() * productList.length)];
    if (Math.random() < 0.3 && 0 < luckyItem.quantity) {
      luckyItem.price = Math.round(luckyItem.price * DiscountedRate.lucky);
      alert(`번개세일! ${luckyItem.name}이(가) 20% 할인 중입니다!`);
      updateSelectOptions();
    }
  }, 30000);
}, Math.random() * 10000);

// 추천상품 할인 이벤트
setTimeout(function () {
  setInterval(function () {
    if (lastSell) {
      const suggest = productList.find(function (item) {
        return item.id !== lastSell && 0 < item.quantity;
      });
      if (suggest) {
        alert(`${suggest.name} 은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);
        suggest.price = Math.round(suggest.price * DiscountedRate.suggest);
        updateSelectOptions();
      }
    }
  }, 60000);
}, Math.random() * 20000);

main();

// addButton 클릭시 이벤트 등록
addButton.addEventListener('click', function () {
  const selectedItem = select.price;
  const itemToAdd = productList.find(function (p) {
    return p.id === selectedItem;
  });

  if (itemToAdd && 0 < itemToAdd.quantity) {
    let item = document.getElementById(itemToAdd.id);

    if (item) {
      let newQuantity = parseInt(item.querySelector('span').textContent.split('x ')[1]) + 1;

      if (newQuantity <= itemToAdd.quantity) {
        item.querySelector('span').textContent =
          itemToAdd.name + ' - ' + itemToAdd.price + '원 x ' + newQuantity;
        itemToAdd.quantity--;
      } else {
        alert('재고가 부족합니다.');
      }
    } else {
      <div id={itemToAdd.id} className="flex justify-between items-center mb-2">
        <span>
          {itemToAdd.name} - {itemToAdd.price}원 x 1
        </span>
        <div>
          <button
            class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
            data-product-id={itemToAdd.id}
            data-change="-1"
          >
            -
          </button>
          <button
            class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
            data-product-id={itemToAdd.id}
            data-change="1"
          >
            +
          </button>
          <button
            class="remove-item bg-red-500 text-white px-2 py-1 rounded"
            data-product-id={itemToAdd.id}
          >
            삭제
          </button>
        </div>
      </div>;

      cartDisplay.appendChild(newItem);

      itemToAdd.quantity--;
    }

    calculateCart();

    lastSell = selItem;
  }
});

// cartDisplay 클릭시 이벤트 등록
cartDisplay.addEventListener('click', function (event) {
  let target = event.target;
  if (target.classList.contains('quantity-change') || target.classList.contains('remove-item')) {
    let productId = target.dataset.productId;
    let itemElement = document.getElementById(productId);
    let product = productList.find(function (p) {
      return p.id === productId;
    });

    if (target.classList.contains('quantity-change')) {
      let quantityChange = parseInt(target.dataset.change);
      let newQuantity =
        parseInt(itemElement.querySelector('span').textContent.split('x ')[1]) + quantityChange;

      if (
        0 < newQuantity &&
        newQuantity <=
          product.quantity + parseInt(itemElement.querySelector('span').textContent.split('x ')[1])
      ) {
        itemElement.querySelector('span').textContent =
          itemElement.querySelector('span').textContent.split('x ')[0] + 'x ' + newQuantity;
        product.quantity -= quantityChange;
      } else if (newQuantity <= 0) {
        itemElement.remove();
        product.quantity -= quantityChange;
      } else {
        alert('재고가 부족합니다.');
      }
    } else if (target.classList.contains('remove-item')) {
      let removeQuantity = parseInt(itemElement.querySelector('span').textContent.split('x ')[1]);
      product.quantity += removeQuantity;
      itemElement.remove();
    }

    calculateCart();
  }
});
