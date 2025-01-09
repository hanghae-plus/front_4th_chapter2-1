import { useState } from 'react';

import { AddToCartButton } from '../components/AddToCartButton';
import { CartProductList } from '../components/CartProductList';
import { Header } from '../components/Header';
import { ProductSelect } from '../components/ProductSelect';
import { Stock } from '../components/Stock';
import { TotalPrice } from '../components/TotalPrice';
import { useAddToCart } from '../hooks/useAddToCart';
import { useFlashSale } from '../hooks/useFlashSale';
import { useSuggestionSale } from '../hooks/useSuggestionSale';
import { useProducts } from '../stores/ProductContext';
export const Main = () => {
  const {
    state: { items },
  } = useProducts();
  const [selectedItemId, setSelectedItemId] = useState<string | null>(items[0].id);
  const { handleAddToCart } = useAddToCart();

  useFlashSale();
  useSuggestionSale(selectedItemId);

  return (
    <div className="bg-gray-100 p-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
        <Header />
        <CartProductList />
        <TotalPrice />
        <ProductSelect products={items} onSelect={setSelectedItemId} />
        <AddToCartButton onClickButton={() => handleAddToCart(selectedItemId)} />
        <Stock stockStatus={[]} />
      </div>
    </div>
  );
};
