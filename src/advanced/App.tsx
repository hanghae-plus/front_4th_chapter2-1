import { Main } from './page/Main';
import { CartProvider } from './stores/CartContext';
import { ProductsProvider } from './stores/ProductContext';

const App = () => {
  return (
    <ProductsProvider>
      <CartProvider>
        <Main />
      </CartProvider>
    </ProductsProvider>
  );
};

export default App;
