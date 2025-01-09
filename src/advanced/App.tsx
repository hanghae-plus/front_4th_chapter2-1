import { useState } from 'react';

import { AddToCartButton } from './components/AddToCartButton';
import { CartProductList } from './components/CartProductList';
import { Header } from './components/Header';
import { ProductSelect } from './components/ProductSelect';
import { Stock } from './components/Stock';
import { TotalPrice } from './components/TotalPrice';
import { CartProvider } from './stores/CartContext';
import { Products } from './stores/product.store';
import { ProductsProvider } from './stores/ProductContext';

const App = () => {
  const AppProducts = Products;
  const [selectedItemId, setSelectedItemId] = useState<string | null>(AppProducts.items[0].id);

  return (
    <ProductsProvider>
      <CartProvider>
        <div className="bg-gray-100 p-8">
          <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
            <Header />
            <CartProductList />
            <TotalPrice />
            <ProductSelect products={AppProducts.items} onSelect={setSelectedItemId} />
            <AddToCartButton selectedItemId={selectedItemId} />
            <Stock stockStatus={[]} />
          </div>
        </div>
      </CartProvider>
    </ProductsProvider>
  );
};

export default App;
