import { ProductSelect } from './components/ProductSelect.js';
import { CartSummary } from './components/CartSummary.js';
import { useCart } from './state/useCart.js';
import { useProducts } from './state/useProduct.js';
import { AddButton } from './components/AddButton.js';
import { CartItemList } from './components/CartItemList.js';

function App(rootElement) {
  const { getCart, addToCart, removeFromCart, subscribeCart, updateItemQuantity } = useCart();
  const { getProducts, updateQuantity, updatePrice, subscribeProduct } = useProducts();

  const cart = getCart();
  const products = getProducts();

  // 상품 선택 컴포넌트
  const productSelect = ProductSelect({
    products: products,
  });

  // 장바구니 정보 컴포넌트
  const cartSummary = CartSummary({
    cartItems: cart,
  });

  // 장바구니 목록 컴포넌트
  const cartItemList = CartItemList({ cartItems: cart });

  // 장바구니 추가 컴포넌트
  const addButton = AddButton({
    onClick: () => {
      addToCart(productSelect.getElement().value);
    },
  });

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
  cartItemsContainer.appendChild(cartItemList.getElement());

  subscribeProduct(() => {
    productSelect.render();
  });

  subscribeCart(() => {
    cartItemList.render();
    cartSummary.render();
  });

  // 초기 렌더링
  productSelect.render();
  cartSummary.render();
  cartItemList.render();

  rootElement.appendChild(container);
}

export default App;
