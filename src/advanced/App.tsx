import Cart from './components/cart';
import CartAddButton from './components/cart-add-button/CartAddButton';
import CartTotal from './components/cart-total';
import Container from './components/Container';
import ContentWrapper from './components/ContentWrapper';
import Header from './components/Header';
import ProductSelect from './components/product-select';
import StockStatus from './components/stock-status';
import { ProductProvider } from './store/ProductContext';

export default function App() {
  return (
    <Container>
      <ContentWrapper>
        <Header title='장바구니' />
        <ProductProvider>
          <Cart />
          <CartTotal />
          <ProductSelect />
          <CartAddButton />
          <StockStatus />
        </ProductProvider>
      </ContentWrapper>
    </Container>
  );
}
