import Cart from './components/cart/Cart';
import CartAddButton from './components/cartAddButton/CartAddButton';
import CartTotal from './components/cartTotal/CartTotal';
import { renderCalculateCart } from './components/cartTotal/renderCalculateCart';
import Container from './components/Container';
import ContentWrapper from './components/ContentWrapper';
import Header from './components/Header';
import { updateSelectOptions } from './components/productSelect/updateSelectOptions';
import ProductSelector from './components/productSelector/ProductSelector';
import StockStatus from './components/stockStatus/StockStatus';
import { CONSTANTS } from './constants';
import { ProductStore } from './store/productStore';
import { helper } from './utils/helper';

let lastSelectedItem;

function main() {
  const contentWrapper = ContentWrapper();

  contentWrapper.appendChild(Header({ title: '장바구니' }));
  contentWrapper.appendChild(Cart());
  contentWrapper.appendChild(CartTotal());
  contentWrapper.appendChild(ProductSelector());
  contentWrapper.appendChild(CartAddButton());
  contentWrapper.appendChild(StockStatus());

  const containerDiv = Container();
  containerDiv.appendChild(contentWrapper);

  const root = document.getElementById('app');
  root.appendChild(containerDiv);

  const productStore = ProductStore.getInstance();
  const products = productStore.getState().products;

  updateSelectOptions(products);
  renderCalculateCart(products);

  setTimeout(function () {
    setInterval(function () {
      const luckyItem = products[Math.floor(Math.random() * products.length)];

      if (
        Math.random() < CONSTANTS.RANDOM_SALE_RATE &&
        luckyItem.quantity > 0
      ) {
        luckyItem.price = Math.round(
          luckyItem.price * CONSTANTS.LIGHTNING_SALE_RATE,
        );
        alert(helper.getLightningSaleMessage(luckyItem.name));
        updateSelectOptions(products);
      }
    }, CONSTANTS.LIGHTNING_SALE_INTERVAL);
  }, Math.random() * CONSTANTS.LIGHTNING_SALE_DELAY);

  setTimeout(function () {
    setInterval(function () {
      if (lastSelectedItem) {
        const suggest = products.find(function (item) {
          return item.id !== lastSelectedItem && item.quantity > 0;
        });

        if (suggest) {
          alert(helper.getSuggestionMessage(suggest.name));
          suggest.price = Math.round(
            suggest.price * CONSTANTS.SUGGESTION_DISCOUNT_RATE,
          );
          updateSelectOptions(products);
        }
      }
    }, CONSTANTS.SUGGESTION_INTERVAL);
  }, Math.random() * CONSTANTS.SUGGESTION_DELAY);
}

main();

const addToCartButton = document.getElementById('add-to-cart');
addToCartButton.addEventListener('click', function () {
  const productSelector = document.getElementById('product-select');
  const selectedItem = productSelector.value;

  const productStore = ProductStore.getInstance();
  const products = productStore.getState().products;
  const productToAdd = productStore.findProduct(selectedItem);

  if (productToAdd && productToAdd.quantity > 0) {
    const productElement = document.getElementById(productToAdd.id);

    if (productElement) {
      const newQuantity =
        parseInt(
          productElement.querySelector('span').textContent.split('x ')[1],
        ) + 1;

      if (newQuantity <= productToAdd.quantity) {
        productElement.querySelector('span').textContent =
          productToAdd.name +
          ' - ' +
          productToAdd.price +
          '원 x ' +
          newQuantity;

        productStore.updateProductQuantity(productToAdd.id, -1);
      } else {
        alert(CONSTANTS.OUT_OF_STOCK_MESSAGE);
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

      const cart = document.getElementById('cart-items');
      cart.appendChild(newProduct);
      productStore.updateProductQuantity(productToAdd.id, -1);
    }

    renderCalculateCart(products);
    lastSelectedItem = selectedItem;
  }
});

const cart = document.getElementById('cart-items');
cart.addEventListener('click', function (event) {
  const targetElement = event.target;
  if (
    targetElement.classList.contains('quantity-change') ||
    targetElement.classList.contains('remove-item')
  ) {
    const productId = targetElement.dataset.productId;
    const cartProductElement = document.getElementById(productId);

    const productStore = ProductStore.getInstance();
    const products = productStore.getState().products;
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
        productStore.updateProductQuantity(selectedProduct.id, -quantityChange);
      } else if (newQuantity <= 0) {
        cartProductElement.remove();
        productStore.updateProductQuantity(selectedProduct.id, -quantityChange);
      } else {
        alert(CONSTANTS.OUT_OF_STOCK_MESSAGE);
      }
    } else if (targetElement.classList.contains('remove-item')) {
      const removedQuantity = parseInt(
        cartProductElement.querySelector('span').textContent.split('x ')[1],
      );
      productStore.updateProductQuantity(selectedProduct.id, removedQuantity);
      cartProductElement.remove();
    }

    renderCalculateCart(products);
  }
});
