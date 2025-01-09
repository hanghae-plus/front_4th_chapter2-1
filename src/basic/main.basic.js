import App from './app';
import { renderCalculateCart } from './components/cartTotal/renderCalculateCart';
import { updateSelectOptions } from './components/productSelect/updateSelectOptions';
import { ProductStore } from './store/productStore';
import { startLightningSale } from './utils/startLighteningSale';
import { startSuggestion } from './utils/startSuggestion';

function main() {
  const root = document.getElementById('app');
  root.appendChild(App());

  const { products, lastSelectedItem } = ProductStore.getInstance().getState();
  updateSelectOptions(products);
  renderCalculateCart(products);

  startLightningSale(products);
  startSuggestion(products, lastSelectedItem);
}

main();
