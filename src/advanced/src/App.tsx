import './App.css';
import { CartProvider } from './context/CartContext';
import { useSpecialSale, useAdditionSale } from './hooks/useAsyncSale';
import Cart from './pages/Cart';

const SaleManager = () => {
  useSpecialSale();
  useAdditionSale();
  return null;
};

function App() {
  return (
    <CartProvider>
      <SaleManager />
      <div className="bg-gray-100 min-h-screen w-full p-8">
        <Cart />
      </div>
    </CartProvider>
  );
}

export default App;
