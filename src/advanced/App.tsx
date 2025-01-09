import { AddToCartButton } from './components/AddToCartButton';
import { CartProductList } from './components/CartProductList';
import { Header } from './components/Header';
import { ProductSelect } from './components/ProductSelect';
import { StockStatus } from './components/StockStatus';
import { TotalPrice } from './components/TotalPrice';

import type { Product } from './types/product.type';

const App = () => {
  const Products = [
    { id: 'p1', name: '상품1', originalPrice: 10000, quantity: 50 },
    { id: 'p2', name: '상품2', originalPrice: 20000, quantity: 30 },
    { id: 'p3', name: '상품3', originalPrice: 30000, quantity: 20 },
    { id: 'p4', name: '상품4', originalPrice: 15000, quantity: 0 },
    { id: 'p5', name: '상품5', originalPrice: 25000, quantity: 10 },
  ] as Product[];

  return (
    <div className="bg-gray-100 p-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
        <Header />
        <CartProductList cartItems={Products} />
        <TotalPrice />
        <ProductSelect />
        <AddToCartButton />
        <StockStatus />
      </div>
    </div>
  );
};

export default App;
