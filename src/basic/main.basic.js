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
import { ProductStore } from './store/productStore';
import { helper } from './utils/helper';

function main() {
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

  const productStore = ProductStore.getInstance();
  const products = productStore.getState().products;
  const lastSelectedItem = productStore.getState().lastSelectedItem;

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
