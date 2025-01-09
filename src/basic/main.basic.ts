import { getTotalPriceBeforeSpecialOffer } from './features/cart/actions/getTotalPriceBeforeSpecialOffer';
import { renderBonusPoints } from './features/cart/actions/renderBonusPoint';
import { NewCartItem } from './features/cart/views/NewCartItem';
import { getStockInfo } from './features/product/actions/getStockInfo';
import { luckyAlert } from './features/product/actions/luckyAlert';
import ProductOption from './features/product/views/ProductOption';
import { productList } from './shared/entity/data/productList';

let SelectView, AddToCartButton, CartItemsView, TotalCostView, StockInfoView;

function main() {
  const Root = document.getElementById('app');
  const Container = document.createElement('div');
  const Wrapper = document.createElement('div');
  const LargeHeading = () =>
    `<h1 class="text-2xl font-bold mb-4">장바구니</h1>`;
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
  TotalCostView.className = 'text-xl font-bold my-4';
  SelectView.className = 'border rounded p-2 mr-2';
  AddToCartButton.className = 'bg-blue-500 text-white px-4 py-2 rounded';
  StockInfoView.className = 'text-sm text-gray-500 mt-2';
  AddToCartButton.textContent = '추가';
  updateSelectedOptions();
  Wrapper.innerHTML = LargeHeading();
  Wrapper.appendChild(CartItemsView);
  Wrapper.appendChild(TotalCostView);
  Wrapper.appendChild(SelectView);
  Wrapper.appendChild(AddToCartButton);
  Wrapper.appendChild(StockInfoView);
  Container.appendChild(Wrapper);
  Root.appendChild(Container);
  calculateCartItems();

  luckyAlert(productList, updateSelectedOptions);
}
function updateSelectedOptions() {
  SelectView.innerHTML = '';
  const Options = productList.reduce((template, item) => {
    const OptionView = ProductOption({
      product: item,
    });
    return template + OptionView.view;
  }, '');
  SelectView.innerHTML = Options;
}
function calculateCartItems() {
  let finalPrice = 0;
  const cartItems = CartItemsView.children as unknown as HTMLDivElement[];
  const { subTotalPrice, totalItemCount, totalPrice } =
    getTotalPriceBeforeSpecialOffer(cartItems, productList);

  finalPrice = totalPrice;
  let discountRate = 0;
  if (totalItemCount >= 30) {
    const bulkDiscount = totalPrice * 0.25;
    const itemDiscount = subTotalPrice - totalPrice;
    if (bulkDiscount > itemDiscount) {
      finalPrice = subTotalPrice * (1 - 0.25);
      discountRate = 0.25;
    } else {
      discountRate = (subTotalPrice - finalPrice) / subTotalPrice;
    }
  } else {
    discountRate = (subTotalPrice - finalPrice) / subTotalPrice;
  }
  if (new Date().getDay() === 2) {
    finalPrice *= 1 - 0.1;
    discountRate = Math.max(discountRate, 0.1);
  }
  TotalCostView.textContent = '총액: ' + Math.round(finalPrice) + '원';
  if (discountRate > 0) {
    const DiscountText = document.createElement('span');
    DiscountText.className = 'text-green-500 ml-2';
    DiscountText.textContent =
      '(' + (discountRate * 100).toFixed(1) + '% 할인 적용)';
    TotalCostView.appendChild(DiscountText);
  }
  StockInfoView.textContent = getStockInfo(productList);
  renderBonusPoints(finalPrice, (PointTag) => {
    TotalCostView.appendChild(PointTag);
  });
}

main();
AddToCartButton.addEventListener('click', function () {
  const selectedItemId = SelectView.value;
  const itemToAdd = productList.find(function (p) {
    return p.id === selectedItemId;
  });
  if (itemToAdd && itemToAdd.quantity > 0) {
    const item = document.getElementById(itemToAdd.id);
    if (item) {
      const newQty =
        parseInt(item.querySelector('span').textContent.split('x ')[1]) + 1;
      if (newQty <= itemToAdd.quantity) {
        item.querySelector('span').textContent =
          itemToAdd.name + ' - ' + itemToAdd.price + '원 x ' + newQty;
        itemToAdd.quantity--;
      } else {
        alert('재고가 부족합니다.');
      }
    } else {
      const newItem = document.createElement('div');
      newItem.id = itemToAdd.id;
      newItem.className = 'flex justify-between items-center mb-2';

      newItem.innerHTML = NewCartItem({ item: itemToAdd });
      CartItemsView.appendChild(newItem);
      itemToAdd.quantity--;
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
          currentProduct.quantity +
            parseInt(
              itemElement.querySelector('span').textContent.split('x ')[1],
            )
      ) {
        itemElement.querySelector('span').textContent =
          itemElement.querySelector('span').textContent.split('x ')[0] +
          'x ' +
          newQty;
        currentProduct.quantity -= quantityChangeAmount;
      } else if (newQty <= 0) {
        itemElement.remove();
        currentProduct.quantity -= quantityChangeAmount;
      } else {
        alert('재고가 부족합니다.');
      }
    } else if (targetElement.classList.contains('remove-item')) {
      const removeItemCounts = parseInt(
        itemElement.querySelector('span').textContent.split('x ')[1],
      );
      currentProduct.quantity += removeItemCounts;
      itemElement.remove();
    }
    calculateCartItems();
  }
});
