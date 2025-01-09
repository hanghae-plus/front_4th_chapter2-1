import { calculateCartItems } from './features/cart/actions/calculateCartItems';
import { renderBonusPoints } from './features/cart/actions/renderBonusPoint';
import { NewCartItem } from './features/cart/views/NewCartItem';
import { getStockInfo } from './features/product/actions/getStockInfo';
import { luckyAlert } from './features/product/actions/luckyAlert';
import ProductOption from './features/product/views/ProductOption';
import { productList } from './shared/entity/data/productList';

const renderAfterDiscount = (finalPrice: number, discountRate: number) => {
  const TotalCostView = document.getElementById('cart-total');
  const StockInfoView = document.getElementById('stock-status');
  if (!TotalCostView || !StockInfoView) return;

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
};

function main() {
  const Root = document.getElementById('app');
  if (!Root) return;
  Root.innerHTML = `
  <div class="bg-gray-100 p-8">
    <div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
      <h1 class="text-2xl font-bold mb-4">장바구니</h1>
      <div id="cart-items"></div>
      <div id="cart-total" class="text-xl font-bold my-4"></div>
      <select id="product-select" class="border rounded p-2 mr-2"></select>
      <button id="add-to-cart" class="bg-blue-500 text-white px-4 py-2 rounded">추가</button>
      <div id="stock-status" class="text-sm text-gray-500 mt-2"></div>
    </div>
  `;
  updateSelectedOptions();
  calculateCartItems(
    {
      cartItems:
        document.getElementById('cart-items')?.children || new HTMLCollection(),
      productList,
    },
    renderAfterDiscount,
  );

  luckyAlert(productList, updateSelectedOptions);
}

function updateSelectedOptions() {
  const SelectView = document.getElementById('product-select');
  if (!SelectView) return;

  SelectView.innerHTML = '';
  const Options = productList.reduce((template, item) => {
    const OptionView = ProductOption({
      product: item,
    });
    return template + OptionView.view;
  }, '');
  SelectView.innerHTML = Options;
}
main();

const AddToCartButton = document.getElementById('add-to-cart');

AddToCartButton?.addEventListener('click', function () {
  const CartItemsView = document.getElementById('cart-items');
  const SelectView = document.getElementById(
    'product-select',
  ) as HTMLSelectElement;
  if (!CartItemsView || !SelectView) return;
  const selectedItemId = SelectView.value;
  const itemToAdd = productList.find(function (p) {
    return p.id === selectedItemId;
  });
  if (itemToAdd && itemToAdd.quantity > 0) {
    const itemElement = document.getElementById(itemToAdd.id);
    const cartItemInfoSpan = itemElement?.querySelector('span');
    const cartItemSelectedCount = cartItemInfoSpan?.textContent?.split('x ')[1];
    if (cartItemSelectedCount) {
      const newQty = parseInt(cartItemSelectedCount) + 1;
      if (newQty <= itemToAdd.quantity) {
        cartItemInfoSpan.textContent =
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
    calculateCartItems(
      {
        cartItems: CartItemsView.children,
        productList,
      },
      renderAfterDiscount,
    );
  }
});

const CartItemsView = document.getElementById('cart-items');
CartItemsView?.addEventListener('click', function (event: MouseEvent) {
  const targetElement = event.target as HTMLElement | null;

  if (!targetElement) return;

  if (
    targetElement.classList.contains('quantity-change') ||
    targetElement.classList.contains('remove-item')
  ) {
    const productId = targetElement.dataset.productId;
    if (!productId) return;
    const currentProduct = productList.find(function (p) {
      return p.id === productId;
    });
    const itemElement = document.getElementById(productId);
    const cartItemInfoSpan = itemElement?.querySelector('span');
    const cartItemSelectedCount = cartItemInfoSpan?.textContent?.split('x ')[1];
    if (!currentProduct) return;
    if (
      targetElement.classList.contains('quantity-change') &&
      targetElement.dataset.change &&
      itemElement &&
      cartItemSelectedCount
    ) {
      const quantityChangeAmount = parseInt(targetElement.dataset.change);

      const newQty = parseInt(cartItemSelectedCount) + quantityChangeAmount;
      if (
        newQty > 0 &&
        newQty <= currentProduct.quantity + parseInt(cartItemSelectedCount)
      ) {
        cartItemInfoSpan.textContent = `${currentProduct.name} - ${currentProduct.price}원 x ${newQty}`;
        currentProduct.quantity -= quantityChangeAmount;
      } else if (newQty <= 0) {
        itemElement.remove();
        currentProduct.quantity -= quantityChangeAmount;
      } else {
        alert('재고가 부족합니다.');
      }
    } else if (
      targetElement.classList.contains('remove-item') &&
      itemElement &&
      cartItemSelectedCount
    ) {
      const removeItemCounts = parseInt(cartItemSelectedCount);
      currentProduct.quantity += removeItemCounts;
      itemElement.remove();
    }
    calculateCartItems(
      {
        cartItems: CartItemsView.children,
        productList,
      },
      renderAfterDiscount,
    );
  }
});
