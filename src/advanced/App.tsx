import { useState } from 'react';

import { AddToCartButton } from './components/AddToCartButton';
import { CartProductList } from './components/CartProductList';
import { Header } from './components/Header';
import { ProductSelect } from './components/ProductSelect';
import { Stock } from './components/Stock';
import { TotalPrice } from './components/TotalPrice';
import { calculateFinalAmount } from './services/calcProductDiscount';
import { Cart } from './stores/cart.store';
import { Products } from './stores/product.store';

const App = () => {
  const AppProducts = Products;
  const AppCart = Cart;

  const { amount, discountRate } = calculateFinalAmount(AppCart.items);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(AppProducts.items[0].id);

  const handleAddToCart = () => {
    if (!selectedItemId) return;

    if (AppProducts.getItem(selectedItemId)?.quantity > 0) {
      Cart.addItem(AppProducts.getItem(selectedItemId), 1);
      Products.decreaseQuantity(selectedItemId, 1);
    } else {
      alert('재고가 부족합니다');
    }
  };

  return (
    <div className="bg-gray-100 p-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
        <Header />
        <CartProductList cartItems={AppCart.items} />
        <TotalPrice totalAmount={amount} discountRate={discountRate} />
        <ProductSelect products={AppProducts.items} onSelect={setSelectedItemId} />
        <AddToCartButton onClick={handleAddToCart} />
        <Stock stockStatus={[]} />
      </div>
    </div>
  );
};

export default App;
