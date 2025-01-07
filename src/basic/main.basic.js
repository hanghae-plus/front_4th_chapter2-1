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
import { helper } from './utils/helper';

let products, lastSelectedItem;

function main() {
  products = [
    { id: 'p1', name: '상품1', price: 10_000, quantity: 50 },
    { id: 'p2', name: '상품2', price: 20_000, quantity: 30 },
    { id: 'p3', name: '상품3', price: 30_000, quantity: 20 },
    { id: 'p4', name: '상품4', price: 15_000, quantity: 0 },
    { id: 'p5', name: '상품5', price: 25_000, quantity: 10 },
  ];

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
      productToAdd.quantity--;
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
        alert(CONSTANTS.OUT_OF_STOCK_MESSAGE);
      }
    } else if (targetElement.classList.contains('remove-item')) {
      const removedQuantity = parseInt(
        cartProductElement.querySelector('span').textContent.split('x ')[1],
      );
      selectedProduct.quantity += removedQuantity;
      cartProductElement.remove();
    }

    renderCalculateCart(products);
  }
});
