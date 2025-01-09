import React, { useState, useEffect } from 'react';
import Cart from './components/Cart';
import ProductSelector from './components/ProductSelector';
import { calculateSubTotal, applyBulkDiscount, applyProductDiscounts } from './utils/cartUtils';
import { ProductItemType } from './types';
import { DISCOUNTS, BULK_DISCOUNT } from './constants/cart';

const App: React.FC = () => {
  const [state, setState] = useState<{
    productList: ProductItemType[];
    totalAmount: number;
  }>({
    productList: [
      { id: 'p1', name: '상품1', price: 10000, quantity: 50 },
      { id: 'p2', name: '상품2', price: 20000, quantity: 30 },
      { id: 'p3', name: '상품3', price: 30000, quantity: 20 },
      { id: 'p4', name: '상품4', price: 15000, quantity: 0 },
      { id: 'p5', name: '상품5', price: 25000, quantity: 10 },
    ],
    totalAmount: 0,
  });

  const [cartItems, setCartItems] = useState<any[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  useEffect(() => {
    calculateCart();
  }, [cartItems]);

  const calculateCart = () => {
    const subTotal = calculateSubTotal(cartItems, state.productList);
    const itemCount = cartItems.reduce((count, item) => count + item.quantity, 0);

    let discountRate = applyBulkDiscount(
      subTotal,
      itemCount,
      BULK_DISCOUNT.THRESHOLD,
      BULK_DISCOUNT.RATE,
    );
    discountRate += applyProductDiscounts(cartItems, state.productList, DISCOUNTS);

    setState((prevState) => ({
      ...prevState,
      totalAmount: subTotal * (1 - discountRate),
    }));
  };

  const handleAddToCart = () => {
    if (selectedProductId) {
      const selectedProduct = state.productList.find((product) => product.id === selectedProductId);
      if (selectedProduct && selectedProduct.quantity > 0) {
        setCartItems([...cartItems, { ...selectedProduct, quantity: 1 }]);
      }
    }
  };

  const handleQuantityChange = (itemId: string, change: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, quantity: item.quantity + change } : item,
      ),
    );
  };

  const handleRemoveItem = (itemId: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  return (
    <div className='bg-gray-100 p-8'>
      <Cart
        items={cartItems}
        totalAmount={state.totalAmount}
        onQuantityChange={handleQuantityChange}
        onRemove={handleRemoveItem}
      />
      <ProductSelector
        products={state.productList}
        selectedProductId={selectedProductId}
        onProductChange={setSelectedProductId}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
};

export default App;
