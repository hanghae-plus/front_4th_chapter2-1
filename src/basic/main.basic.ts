import { productList } from './features/product';

var SelectView, AddToCartButton, CartItemsView, TotalCostView, StockInfoView;
var lastSelectedItemValue,
  bonusPoints = 0,
  totalAmount = 0,
  itemCount = 0;
function main() {
  var Root = document.getElementById('app');
  let Container = document.createElement('div');
  var Wrapper = document.createElement('div');
  let LargeHeading = document.createElement('h1');
  CartItemsView = document.createElement('div');
  TotalCostView = document.createElement('div');
  SelectView = document.createElement('select');
  AddToCartButton = document.createElement('button');
  StockInfoView = document.createElement('div');
  CartItemsView.id = 'cart-items';
  TotalCostView.id = 'cart-total';
  SelectView.id = 'product-select';
  AddToCartButton.id = 'add-to-cart';
  StockInfoView.id = 'stock-status';
  Container.className = 'bg-gray-100 p-8';
  Wrapper.className =
    'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8';
  LargeHeading.className = 'text-2xl font-bold mb-4';
  TotalCostView.className = 'text-xl font-bold my-4';
  SelectView.className = 'border rounded p-2 mr-2';
  AddToCartButton.className = 'bg-blue-500 text-white px-4 py-2 rounded';
  StockInfoView.className = 'text-sm text-gray-500 mt-2';
  LargeHeading.textContent = '장바구니';
  AddToCartButton.textContent = '추가';
  updateSelectedOptions();
  Wrapper.appendChild(LargeHeading);
  Wrapper.appendChild(CartItemsView);
  Wrapper.appendChild(TotalCostView);
  Wrapper.appendChild(SelectView);
  Wrapper.appendChild(AddToCartButton);
  Wrapper.appendChild(StockInfoView);
  Container.appendChild(Wrapper);
  Root.appendChild(Container);
  calculateCartItems();
  setTimeout(function () {
    setInterval(function () {
      var luckyItem =
        productList[Math.floor(Math.random() * productList.length)];
      if (Math.random() < 0.3 && luckyItem.q > 0) {
        luckyItem.val = Math.round(luckyItem.val * 0.8);
        alert('번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!');
        updateSelectedOptions();
      }
    }, 30000);
  }, Math.random() * 10000);
  setTimeout(function () {
    setInterval(function () {
      if (lastSelectedItemValue) {
        var suggest = productList.find(function (item) {
          return item.id !== lastSelectedItemValue && item.q > 0;
        });
        if (suggest) {
          alert(
            suggest.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!',
          );
          suggest.val = Math.round(suggest.val * 0.95);
          updateSelectedOptions();
        }
      }
    }, 60000);
  }, Math.random() * 20000);
}
function updateSelectedOptions() {
  SelectView.innerHTML = '';
  productList.forEach(function (item) {
    var OptionView = document.createElement('option');
    OptionView.value = item.id;
    OptionView.textContent = item.name + ' - ' + item.val + '원';
    if (item.q === 0) OptionView.disabled = true;
    SelectView.appendChild(OptionView);
  });
}
function calculateCartItems() {
  totalAmount = 0;
  itemCount = 0;
  var cartItems = CartItemsView.children;
  var subTotalPrice = 0;
  for (var i = 0; i < cartItems.length; i++) {
    (function () {
      var currentItem;
      for (var j = 0; j < productList.length; j++) {
        if (productList[j].id === cartItems[i].id) {
          currentItem = productList[j];
          break;
        }
      }
      var q = parseInt(
        cartItems[i].querySelector('span').textContent.split('x ')[1],
      );
      var itemTotalPrice = currentItem.val * q;
      var discountRate = 0;
      itemCount += q;
      subTotalPrice += itemTotalPrice;
      if (q >= 10) {
        if (currentItem.id === 'p1') discountRate = 0.1;
        else if (currentItem.id === 'p2') discountRate = 0.15;
        else if (currentItem.id === 'p3') discountRate = 0.2;
        else if (currentItem.id === 'p4') discountRate = 0.05;
        else if (currentItem.id === 'p5') discountRate = 0.25;
      }
      totalAmount += itemTotalPrice * (1 - discountRate);
    })();
  }
  let discountRate = 0;
  if (itemCount >= 30) {
    var bulkDiscount = totalAmount * 0.25;
    var itemDiscount = subTotalPrice - totalAmount;
    if (bulkDiscount > itemDiscount) {
      totalAmount = subTotalPrice * (1 - 0.25);
      discountRate = 0.25;
    } else {
      discountRate = (subTotalPrice - totalAmount) / subTotalPrice;
    }
  } else {
    discountRate = (subTotalPrice - totalAmount) / subTotalPrice;
  }
  if (new Date().getDay() === 2) {
    totalAmount *= 1 - 0.1;
    discountRate = Math.max(discountRate, 0.1);
  }
  TotalCostView.textContent = '총액: ' + Math.round(totalAmount) + '원';
  if (discountRate > 0) {
    var DiscountText = document.createElement('span');
    DiscountText.className = 'text-green-500 ml-2';
    DiscountText.textContent =
      '(' + (discountRate * 100).toFixed(1) + '% 할인 적용)';
    TotalCostView.appendChild(DiscountText);
  }
  updateStockInfo();
  renderBonusPoints();
}
const renderBonusPoints = () => {
  bonusPoints = Math.floor(totalAmount / 1000);
  var PointsTag = document.getElementById('loyalty-points');
  if (!PointsTag) {
    PointsTag = document.createElement('span');
    PointsTag.id = 'loyalty-points';
    PointsTag.className = 'text-blue-500 ml-2';
    TotalCostView.appendChild(PointsTag);
  }
  PointsTag.textContent = '(포인트: ' + bonusPoints + ')';
};
function updateStockInfo() {
  var message = '';
  productList.forEach(function (item) {
    if (item.q < 5) {
      message +=
        item.name +
        ': ' +
        (item.q > 0 ? '재고 부족 (' + item.q + '개 남음)' : '품절') +
        '\n';
    }
  });
  StockInfoView.textContent = message;
}
main();
AddToCartButton.addEventListener('click', function () {
  var selectedItemId = SelectView.value;
  var itemToAdd = productList.find(function (p) {
    return p.id === selectedItemId;
  });
  if (itemToAdd && itemToAdd.q > 0) {
    var item = document.getElementById(itemToAdd.id);
    if (item) {
      var newQty =
        parseInt(item.querySelector('span').textContent.split('x ')[1]) + 1;
      if (newQty <= itemToAdd.q) {
        item.querySelector('span').textContent =
          itemToAdd.name + ' - ' + itemToAdd.val + '원 x ' + newQty;
        itemToAdd.q--;
      } else {
        alert('재고가 부족합니다.');
      }
    } else {
      var newItem = document.createElement('div');
      newItem.id = itemToAdd.id;
      newItem.className = 'flex justify-between items-center mb-2';
      newItem.innerHTML =
        '<span>' +
        itemToAdd.name +
        ' - ' +
        itemToAdd.val +
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
      CartItemsView.appendChild(newItem);
      itemToAdd.q--;
    }
    calculateCartItems();
    lastSelectedItemValue = selectedItemId;
  }
});
CartItemsView.addEventListener('click', function (event) {
  var targetElement = event.target;
  if (
    targetElement.classList.contains('quantity-change') ||
    targetElement.classList.contains('remove-item')
  ) {
    var productId = targetElement.dataset.productId;
    var itemElement = document.getElementById(productId);
    var currentProduct = productList.find(function (p) {
      return p.id === productId;
    });
    if (targetElement.classList.contains('quantity-change')) {
      var quantityChangeAmount = parseInt(targetElement.dataset.change);
      var newQty =
        parseInt(itemElement.querySelector('span').textContent.split('x ')[1]) +
        quantityChangeAmount;
      if (
        newQty > 0 &&
        newQty <=
          currentProduct.q +
            parseInt(
              itemElement.querySelector('span').textContent.split('x ')[1],
            )
      ) {
        itemElement.querySelector('span').textContent =
          itemElement.querySelector('span').textContent.split('x ')[0] +
          'x ' +
          newQty;
        currentProduct.q -= quantityChangeAmount;
      } else if (newQty <= 0) {
        itemElement.remove();
        currentProduct.q -= quantityChangeAmount;
      } else {
        alert('재고가 부족합니다.');
      }
    } else if (targetElement.classList.contains('remove-item')) {
      var removeItemCounts = parseInt(
        itemElement.querySelector('span').textContent.split('x ')[1],
      );
      currentProduct.q += removeItemCounts;
      itemElement.remove();
    }
    calculateCartItems();
  }
});
