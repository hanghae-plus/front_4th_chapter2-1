import { getDiscountRate } from './shared/actions/getDiscountRate';
import { DISCOUNT_RATE } from './shared/constant/discountRate';

let productList,
  SelectView,
  AddToCartButton,
  CartItemsView,
  TotalCostView,
  StockInfoView;
let lastSelectedItemValue,
  bonusPoints = 0,
  totalAmount = 0,
  itemCount = 0;
function main() {
  productList = [
    { id: 'p1', name: '상품1', val: 10000, q: 50 },
    { id: 'p2', name: '상품2', val: 20000, q: 30 },
    { id: 'p3', name: '상품3', val: 30000, q: 20 },
    { id: 'p4', name: '상품4', val: 15000, q: 0 },
    { id: 'p5', name: '상품5', val: 25000, q: 10 },
  ];
  const Root = document.getElementById('app');
  const Container = document.createElement('div');
  const Wrapper = document.createElement('div');
  const LargeHeading = document.createElement('h1');
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
      const luckyItem =
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
        const suggest = productList.find(function (item) {
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
    const OptionView = document.createElement('option');
    OptionView.value = item.id;
    OptionView.textContent = item.name + ' - ' + item.val + '원';
    if (item.q === 0) OptionView.disabled = true;
    SelectView.appendChild(OptionView);
  });
}
function calculateCartItems() {
  totalAmount = 0;
  itemCount = 0;
  const cartItems = CartItemsView.children;
  let subTotalPrice = 0;
  for (let i = 0; i < cartItems.length; i++) {
    (function () {
      let currentItem;
      for (let j = 0; j < productList.length; j++) {
        if (productList[j].id === cartItems[i].id) {
          currentItem = productList[j];
          break;
        }
      }
      const q = parseInt(
        cartItems[i].querySelector('span').textContent.split('x ')[1],
      );
      const itemTotalPrice = currentItem.val * q;
      let discountRate = 0;
      itemCount += q;
      subTotalPrice += itemTotalPrice;
      if (q >= 10) {
        if (DISCOUNT_RATE[currentItem.id])
          discountRate = getDiscountRate(currentItem.id);
      }
      totalAmount += itemTotalPrice * (1 - discountRate);
    })();
  }
  let discountRate = 0;
  if (itemCount >= 30) {
    const bulkDiscount = totalAmount * 0.25;
    const itemDiscount = subTotalPrice - totalAmount;
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
    const DiscountText = document.createElement('span');
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
  let PointsTag = document.getElementById('loyalty-points');
  if (!PointsTag) {
    PointsTag = document.createElement('span');
    PointsTag.id = 'loyalty-points';
    PointsTag.className = 'text-blue-500 ml-2';
    TotalCostView.appendChild(PointsTag);
  }
  PointsTag.textContent = '(포인트: ' + bonusPoints + ')';
};
function updateStockInfo() {
  let message = '';
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
  const selectedItemId = SelectView.value;
  const itemToAdd = productList.find(function (p) {
    return p.id === selectedItemId;
  });
  if (itemToAdd && itemToAdd.q > 0) {
    const item = document.getElementById(itemToAdd.id);
    if (item) {
      const newQty =
        parseInt(item.querySelector('span').textContent.split('x ')[1]) + 1;
      if (newQty <= itemToAdd.q) {
        item.querySelector('span').textContent =
          itemToAdd.name + ' - ' + itemToAdd.val + '원 x ' + newQty;
        itemToAdd.q--;
      } else {
        alert('재고가 부족합니다.');
      }
    } else {
      const newItem = document.createElement('div');
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
  const targetElement = event.target;
  if (
    targetElement.classList.contains('quantity-change') ||
    targetElement.classList.contains('remove-item')
  ) {
    const productId = targetElement.dataset.productId;
    const itemElement = document.getElementById(productId);
    const currentProduct = productList.find(function (p) {
      return p.id === productId;
    });
    if (!currentProduct) return;
    if (targetElement.classList.contains('quantity-change')) {
      const quantityChangeAmount = parseInt(targetElement.dataset.change);
      const newQty =
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
      const removeItemCounts = parseInt(
        itemElement.querySelector('span').textContent.split('x ')[1],
      );
      currentProduct.q += removeItemCounts;
      itemElement.remove();
    }
    calculateCartItems();
  }
});
