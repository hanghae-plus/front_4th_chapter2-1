import Cart from './components/cart/Cart';
import CartAddButton from './components/cartAddButton/CartAddButton';
import CartTotal from './components/cartTotal/CartTotal';
import Container from './components/Container';
import ContentWrapper from './components/ContentWrapper';
import Header from './components/Header';
import ProductSelect from './components/productSelect/ProductSelect';
import StockStatus from './components/stockStatus/StockStatus';

export default function App() {
  const contentWrapper = ContentWrapper();
  contentWrapper.appendChild(Header({ title: '장바구니' }));
  contentWrapper.appendChild(Cart());
  contentWrapper.appendChild(CartTotal());
  contentWrapper.appendChild(ProductSelect());
  contentWrapper.appendChild(CartAddButton());
  contentWrapper.appendChild(StockStatus());

  const containerDiv = Container();
  containerDiv.appendChild(contentWrapper);

  return containerDiv;
}
