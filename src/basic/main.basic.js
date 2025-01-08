import App from './components/App.js';
import {
  startLightningSale,
  startRecommendProduct
} from './logic/promotionLogic.js';
import { updateSelectedOptions } from './logic/stockLogic.js';

function main() {
  const root = document.getElementById('app');
  root.appendChild(App());

  const selectedOptions = document.getElementById('product-select');

  updateSelectedOptions(selectedOptions);
  startLightningSale(selectedOptions);
  startRecommendProduct(selectedOptions);
}

//실행
main();
