import { productStore } from './stores/productStore.js';
import { render } from './lib/renderElement.js';
import { registerGlobalEvents } from './lib/eventManager.js';
import { eventTimer } from './utils/eventTimer.js';

function main() {
  productStore.subscribe(render);
  render();

  registerGlobalEvents();

  eventTimer(productStore);
}

main();
