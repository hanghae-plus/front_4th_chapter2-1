import { useEffect } from 'react';

import {
  handleLuckyItemSale,
  handleProductSuggestions,
  startDelayedInterval,
} from './utils/interval-util';
import ShoppingCart from './component/ShoppingCart';
import { CartContextProvider } from './context/CartContext';

const App = () => {
  useEffect(() => {
    startDelayedInterval(() => handleLuckyItemSale(), 30000, 10000);
    startDelayedInterval(() => handleProductSuggestions(), 60000, 20000);
  }, []);

  return (
    <CartContextProvider>
      <ShoppingCart />
    </CartContextProvider>
  );
};

export default App;
