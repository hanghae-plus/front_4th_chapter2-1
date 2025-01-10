import App from './components/App.js';
import {
  startLightningSale,
  startRecommendProduct
} from './logic/promotionLogic.js';
import { initSelectableData } from './logic/stockLogic.js';

function main() {
  const root = document.getElementById('app');
  root.appendChild(App());

  const selectedOptions = document.getElementById('product-select');

  initSelectableData(selectedOptions);
  startLightningSale(selectedOptions);
  startRecommendProduct(selectedOptions);
}

//실행
main();

//여기까지 basic
