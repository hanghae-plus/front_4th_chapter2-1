import { addToCart } from './features/cart/actions/addToCart';
import { renderBonusPoints } from './features/cart/components/BonusPointsVIew';
import { productList } from './features/product';
import {
  findProductById,
  luckyEvent,
  suggestEvent,
} from './features/product/actions';
import { renderProductOptionsView } from './features/product/components/ProductOptionsView';
import { getDiscountRate } from './shared/actions/getDiscountRate';
import { DISCOUNT_RATE } from './shared/constant/discountRate';

var SelectView, AddToCartButton, CartItemsView, TotalCostView, StockInfoView;
var lastSelectedItemValue,
  totalAmount = 0;
let totalItemCount = 0;
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
  renderProductOptionsView(SelectView, productList);
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
      luckyEvent(SelectView, productList);
    }, 30000);
  }, Math.random() * 10000);
  setTimeout(function () {
    setInterval(function () {
      suggestEvent(lastSelectedItemValue, productList, SelectView);
    }, 60000);
  }, Math.random() * 20000);
}

function calculateCartItems() {
  totalAmount = 0;
  totalItemCount = 0;
  var cartItems = CartItemsView.children;
  var subTotalPrice = 0;
  for (var i = 0; i < cartItems.length; i++) {
    (function () {
      const currentItem = productList.find(
        (product) => product.id === cartItems[i].id,
      );
      if (!currentItem) return;
      const currentQuantity = parseInt(
        cartItems[i].querySelector('span').textContent.split('x ')[1],
      );
      var itemTotalPrice = currentItem.val * q;
      var discountRate = 0;
      totalItemCount += currentQuantity;
      subTotalPrice += itemTotalPrice;
      if (currentQuantity >= 10) {
        if (DISCOUNT_RATE[currentItem.id])
          discountRate = getDiscountRate(currentItem.id);
      }
      totalAmount += itemTotalPrice * (1 - discountRate);
    })();
  }
  let discountRate = 0;
  if (totalItemCount >= 30) {
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
  renderBonusPoints(totalAmount, TotalCostView);
}
function updateStockInfo() {
  var message = '';
  productList.forEach(function (item) {
    if (item.quantity < 5) {
      message +=
        item.name +
        ': ' +
        (item.quantity > 0
          ? '재고 부족 (' + item.quantity + '개 남음)'
          : '품절') +
        '\n';
    }
  });
  StockInfoView.textContent = message;
}
main();
AddToCartButton.addEventListener('click', function () {
  const selectedItemId = SelectView.value;
  addToCart(CartItemsView, selectedItemId, productList, () => {
    calculateCartItems();
    lastSelectedItemValue = selectedItemId;
  });
});
CartItemsView.addEventListener('click', function (event) {
  var targetElement = event.target;
  if (
    targetElement.classList.contains('quantity-change') ||
    targetElement.classList.contains('remove-item')
  ) {
    var productId = targetElement.dataset.productId;
    var itemElement = document.getElementById(productId);
    const currentProduct = findProductById(productId, productList);
    if (targetElement.classList.contains('quantity-change')) {
      var quantityChangeAmount = parseInt(targetElement.dataset.change);
      var newQty =
        parseInt(itemElement.querySelector('span').textContent.split('x ')[1]) +
        quantityChangeAmount;
      if (
        newQty > 0 &&
        newQty <=
          currentProduct?.quantity +
            parseInt(
              itemElement.querySelector('span').textContent.split('x ')[1],
            )
      ) {
        itemElement.querySelector('span').textContent =
          itemElement.querySelector('span').textContent.split('x ')[0] +
          'x ' +
          newQty;
        currentProduct?.quantity -= quantityChangeAmount;
      } else if (newQty <= 0) {
        itemElement.remove();
        currentProduct?.quantity -= quantityChangeAmount;
      } else {
        alert('재고가 부족합니다.');
      }
    } else if (targetElement.classList.contains('remove-item')) {
      var removeItemCounts = parseInt(
        itemElement.querySelector('span').textContent.split('x ')[1],
      );
      currentProduct?.quantity += removeItemCounts;
      itemElement.remove();
    }
    calculateCartItems();
  }
});
