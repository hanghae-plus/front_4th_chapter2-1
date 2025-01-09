import './App.css';
import { CartProvider } from './context/CartContext';
import Cart from './pages/Cart';

function App() {
  return (
    <CartProvider>
      <div className="bg-gray-100 min-h-screen w-full p-8">
        <Cart />
      </div>
    </CartProvider>
  );
}

export default App;
