import { Cart } from './component/cart/Cart';
import { ProductSelector } from './component/product-selector/ProductSelector';
import { TotalPrice } from './component/total-price/TotalPrice';

const App = () => {
  return (
    <div className="bg-gray-100 p-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
        <Cart />
        <TotalPrice />
        <ProductSelector />
        <div className="text-sm text-gray-500 mt-2">재고</div>
      </div>
    </div>
  );
};

export default App;
