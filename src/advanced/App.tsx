import { Cart } from './component/cart/Cart';
import { ProductSelector } from './component/product-selector/ProductSelector';
import { StockInfo } from './component/stock-info/StockInfo';
import { TotalPrice } from './component/total-price/TotalPrice';
import { CartProvider } from './contexts/cart-context/CartProvider';
import { ProductProvider } from './contexts/product-context/ProductProvider';

const App = () => {
  return (
    <div className="bg-gray-100 p-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
        <ProductProvider>
          <CartProvider>
            <Cart />
            <TotalPrice />
            <ProductSelector />
            <StockInfo />
          </CartProvider>
        </ProductProvider>
      </div>
    </div>
  );
};

export default App;
