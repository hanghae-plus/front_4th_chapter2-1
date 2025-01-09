import { ProductSelect } from './components/ProductSelect.js';
import { CartSummary } from './components/CartSummary.js';
import { useCart } from './hooks/useCart.js';
import { useProducts } from './hooks/useProduct.js';
import { AddButton } from './components/AddButton.js';
import { CartItemList } from './components/CartItemList.js';
import ProductStatus from './components/ProductStatus.js';
import { usePromotion } from './hooks/usePromotion.js';
import { promotionConfig } from './config/promotionConfig.js';

function App(rootElement) {
  const { subscribeCart, addToCart } = useCart();
  const { getProducts, subscribeProduct, updatePrice } = useProducts();
  const { startPromotion } = usePromotion({ getProducts, updatePrice });

  const initializeComponents = () => {
    const components = {
      productSelect: ProductSelect(),
      cartSummary: CartSummary(),
      cartItemList: CartItemList(),
      addButton: AddButton({
        onClick: () => addToCart(components.productSelect.getElement().value),
      }),
      productStatus: ProductStatus(),
    };

    return components;
  };

  const createLayout = (components) => {
    const container = document.createElement('div');
    container.className = 'bg-gray-100 p-8';
    container.innerHTML = `
      <div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
        <h1 class="text-2xl font-bold mb-4">장바구니</h1>
        <div id="inner-container"></div>
      </div>
    `;

    const innerContainer = container.querySelector('#inner-container');
    Object.values(components).forEach((component) => {
      innerContainer.appendChild(component.getElement());
    });

    return container;
  };

  const setupSubscriptions = (components) => {
    subscribeProduct(() => {
      components.productSelect.render();
      components.productStatus.render();
    });

    subscribeCart(() => {
      components.cartItemList.render();
      components.cartSummary.render();
    });
  };

  const initialRender = (components) => {
    Object.values(components).forEach((component) => component.render());
  };

  const setupPromotions = (components) => {
    const suggestionConfig = {
      ...promotionConfig.suggestion,
      condition: (product) =>
        promotionConfig.suggestion.condition(product, components.productSelect.getElement().value),
    };

    startPromotion(promotionConfig.flash);
    startPromotion(suggestionConfig);
  };

  const components = initializeComponents();
  const layout = createLayout(components);
  setupSubscriptions(components);
  initialRender(components);
  setupPromotions(components);

  rootElement.appendChild(layout);
}

export default App;
