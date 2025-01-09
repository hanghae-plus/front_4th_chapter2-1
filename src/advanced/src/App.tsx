import Cart from './components/Cart';
import { NotifySale } from './components/NotifySale';
import OrderForm from './components/OrderForm';
import StockInfo from './components/StockInfo';
import { SuggestProduct } from './components/SuggestProduct';
import CartProvider from './contexts/CartProvider';
import OrderProvider from './contexts/OrderProvider';
import ProductsProvider from './contexts/ProductsProvider';

const App = () => {
  return (
    <ProductsProvider>
      <CartProvider>
        <OrderProvider>
          <div className="bg-gray-100 p-8">
            <div className="mx-auto max-w-md overflow-hidden rounded-xl bg-white p-8 shadow-md md:max-w-2xl">
              <h1 className="mb-4 text-2xl font-bold">장바구니</h1>
              <Cart />
              <OrderForm />
              <StockInfo />
            </div>
          </div>

          <SuggestProduct />
          <NotifySale />
        </OrderProvider>
      </CartProvider>
    </ProductsProvider>
  );
};

export default App;
