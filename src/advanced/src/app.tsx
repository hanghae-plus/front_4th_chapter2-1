import ShoppingCart from './components/ShoppingCart.tsx';
import { InStockProductListProvider } from './providers/InStockProductListProvider.tsx';
import ShoppingCartProvider from './providers/ShoppingCartProvider.tsx';

const App = () => {
  return (
    <InStockProductListProvider>
      <ShoppingCartProvider>
        <ShoppingCart />
      </ShoppingCartProvider>
    </InStockProductListProvider>
  );
};

export default App;
