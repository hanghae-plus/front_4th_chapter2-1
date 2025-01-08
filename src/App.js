import { ProductSelect } from './components/ProductSelect.js';
import { CartSummary } from './components/CartSummary.js';
import { useCart } from './state/useCart.js';
import { useProducts } from './state/useProduct.js';
import { AddButton } from './components/AddButton.js';

function App(rootElement) {
  const { cart, setCart } = useCart();
  const { products, setProducts } = useProducts();

  const productSelect = ProductSelect({
    products: products,
    onSelect: (productId) => {
      console.log(productId);
    },
  });

  const cartSummary = CartSummary({
    cartItems: cart,
  });

  const addButton = AddButton();

  const container = document.createElement('div');
  container.className = `bg-gray-100 p-8`;
  container.innerHTML = `
<div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
      <h1 class="text-2xl font-bold mb-4">장바구니</h1>
      <div id="cart-items"></div>
      <div id="product-selection" class="flex items-center"></div>
    </div>`;

  const cartItemsContainer = container.querySelector('#cart-items');
  const productSelectionContainer = container.querySelector('#product-selection');

  productSelectionContainer.appendChild(productSelect.getElement());
  productSelectionContainer.appendChild(addButton.getElement());
  cartItemsContainer.before(cartSummary.getElement());

  productSelect.render();
  cartSummary.render();

  rootElement.appendChild(container);
}

export default App;
