import { updateSelectedOptions } from './features/product-select/ui.js';
import { renderCart } from './features/cart-total/ui.js';
import { updateProductQuantity } from './features/cart-item/ui.js';
import { initializePromotions } from './features/promotion/ui.js';

const getProduct = (productList, id) => productList.find((p) => p.id === id);

const appendChild = (parentElement, ...children) => {
  children.forEach((child) => parentElement.appendChild(child));
};

function main() {
  let selectedProductId;
  const products = [
    { id: 'p1', name: '상품1', price: 10_000, quantity: 50 },
    { id: 'p2', name: '상품2', price: 20_000, quantity: 30 },
    { id: 'p3', name: '상품3', price: 30_000, quantity: 20 },
    { id: 'p4', name: '상품4', price: 15_000, quantity: 0 },
    { id: 'p5', name: '상품5', price: 25_000, quantity: 10 },
  ];

  const root = document.getElementById('app');

  const container = document.createElement('div');
  container.className = 'bg-gray-100 p-8';

  const wrapper = document.createElement('div');
  wrapper.className =
    'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8';

  const title = document.createElement('h1');
  title.className = 'text-2xl font-bold mb-4';
  title.textContent = '장바구니';

  const cartElement = document.createElement('div');
  cartElement.id = 'cart-items';

  const totalCartAmountElement = document.createElement('div');
  totalCartAmountElement.id = 'cart-total';
  totalCartAmountElement.className = 'text-xl font-bold my-4';

  const selectProductElement = document.createElement('select');
  selectProductElement.id = 'product-select';
  selectProductElement.className = 'border rounded p-2 mr-2';

  const addCartButton = document.createElement('button');
  addCartButton.id = 'add-to-cart';
  addCartButton.className = 'bg-blue-500 text-white px-4 py-2 rounded';
  addCartButton.textContent = '추가';

  const stockStatusElement = document.createElement('div');
  stockStatusElement.id = 'stock-status';
  stockStatusElement.className = 'text-sm text-gray-500 mt-2';

  updateSelectedOptions(selectProductElement, products);

  appendChild(
    wrapper,
    title,
    cartElement,
    totalCartAmountElement,
    selectProductElement,
    addCartButton,
    stockStatusElement
  );
  appendChild(container, wrapper);
  appendChild(root, container);

  renderCart({
    cartItems: cartElement.children,
    products,
    totalCartAmountElement,
    stockStatusElement,
  });



  addCartButton.addEventListener('click', (e) =>  {
    const selectedProductValue = selectProductElement.value;
    const product = getProduct(products, selectedProductValue);

    if (product && product.quantity > 0) {
      const element = document.getElementById(product.id);

      if (element) {
        const newQty =
          parseInt(element.querySelector('span').textContent.split('x ')[1]) + 1;

        if (newQty <= product.quantity) {
          element.querySelector('span').textContent =
            `${product.name} - ${product.price}원 x ${newQty}`;
          product.quantity--;
        } else {
          alert('재고가 부족합니다.');
        }
      } else {
        const element = document.createElement('div');
        element.id = product.id;
        element.className = 'flex justify-between items-center mb-2';
        element.innerHTML = `
      <span>${product.name} - ${product.price}원 x 1</span>
          <div>
            <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${product.id}" data-change="-1">-</button>
            <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${product.id}" data-change="1">+</button>
            <button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="${product.id}">삭제</button>
          </div>
      `;
        cartElement.appendChild(element);
        product.quantity--;
      }
      renderCart({
        cartItems: cartElement.children,
        products,
        totalCartAmountElement,
        stockStatusElement,
      });
      selectedProductId = selectedProductValue;
    }
  });

  const hasClass = (element, className) => element.classList.contains(className);
  const handleCartEvent = (event, products) => {
    const target = event.target;

    if (
      !hasClass(target, 'quantity-change') &&
      !hasClass(target, 'remove-item')
    ) {
      return;
    }

    const productElement = document.getElementById(target.dataset.productId);
    const product = getProduct(products, target.dataset.productId);

    if (hasClass(target, 'quantity-change')) {
      updateProductQuantity({
        productElement,
        product,
        newQuantity: parseInt(target.dataset.change),
      });
    } else {
      product.quantity += parseInt(
        productElement.querySelector('span').textContent.split('x ')[1]
      );
      productElement.remove();
    }
    renderCart({
      cartItems: cartElement.children,
      products,
      totalCartAmountElement,
      stockStatusElement,
    });
  };

  cartElement.addEventListener('click', (e) => handleCartEvent(e, products));

  initializePromotions(selectProductElement, products, selectedProductId);
}
main();