import { ProductSelect } from './components/ProductSelect.js';
import { CartSummary } from './components/CartSummary.js';
import { useCart } from './hooks/useCart.js';
import { useProducts } from './hooks/useProduct.js';
import { AddButton } from './components/AddButton.js';
import { CartItemList } from './components/CartItemList.js';
import ProductStatus from './components/ProductStatus.js';
import { usePromotion } from './hooks/usePromotion.js';

function App(rootElement) {
  const { subscribeCart, addToCart } = useCart();
  const { getProducts, subscribeProduct, updatePrice } = useProducts();

  const handleAddToCart = () => {
    addToCart(productSelect.getElement().value);
  };

  // 상품 선택 컴포넌트
  const productSelect = ProductSelect();
  const cartSummary = CartSummary();
  const cartItemList = CartItemList();
  const addButton = AddButton({ onClick: handleAddToCart });
  const productStatus = ProductStatus();

  const container = document.createElement('div');
  container.className = `bg-gray-100 p-8`;
  container.innerHTML = `
<div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
      <h1 class="text-2xl font-bold mb-4">장바구니</h1>
        <div id="inner-container"></div>
    </div>`;

  const innerContainer = container.querySelector('#inner-container');
  innerContainer.appendChild(cartSummary.getElement());
  innerContainer.appendChild(cartItemList.getElement());
  innerContainer.appendChild(productSelect.getElement());
  innerContainer.appendChild(addButton.getElement());
  innerContainer.appendChild(productStatus.getElement());

  subscribeProduct(() => {
    console.log('product updated');
    productSelect.render();
    productStatus.render();
  });

  subscribeCart(() => {
    console.log('cart updated');
    cartItemList.render();
    cartSummary.render();
  });

  // 초기 렌더링
  productSelect.render();
  cartSummary.render();
  cartItemList.render();
  productStatus.render();
  addButton.render();

  rootElement.appendChild(container);

  const { startPromotion } = usePromotion({ getProducts, updatePrice });

  const fleshPromotionConfig = {
    id: 'flash-sale',
    delay: Math.random() * 10000,
    interval: 30000,
    condition: (product) => product.quantity > 0,
    chance: 0.3,
    getMessage: (product) => `번개세일! ${product.name}이(가) 20% 할인 중입니다!`,
    priceRate: 0.2,
  };

  const suggestionPromotionConfig = {
    id: 'suggestion-sale',
    delay: Math.random() * 20000,
    interval: 30000,
    chance: 1,
    condition: (product) => product.id !== productSelect.getElement().value && product.quantity > 0,
    getMessage: (product) => `${product.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`,
    priceRate: 0.05,
  };

  startPromotion(fleshPromotionConfig);
  startPromotion(suggestionPromotionConfig);
}

export default App;
