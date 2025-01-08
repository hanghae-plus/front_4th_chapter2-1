import ShoppingCart from './components/ShoppingCart.tsx';
import { ProductListProvider } from './providers/ProductListProvider.tsx';

const App = () => {
  return (
    <ProductListProvider>
      <ShoppingCart />
    </ProductListProvider>
  );
};

export default App;
