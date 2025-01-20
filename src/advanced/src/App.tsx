import React from 'react';
import { UI_CLASSES, UI_TEXT } from './constants';
import { useCart } from './hooks/useCart';
import { useProducts } from './hooks/useProducts';
import { ProductList } from './components/ProductList';
import { CartItem } from './components/CartItem';
import { CartSummary } from './components/CartSummary';
import { StockStatus } from './components/StockStatus';

const initialProducts = [
  { id: 'p1', name: '상품1', price: 10000, quantity: 50 },
  { id: 'p2', name: '상품2', price: 20000, quantity: 30 },
  { id: 'p3', name: '상품3', price: 30000, quantity: 20 },
  { id: 'p4', name: '상품4', price: 15000, quantity: 0 },
  { id: 'p5', name: '상품5', price: 25000, quantity: 10 },
];

export const App: React.FC = () => {
  const { cart, addToCart, updateQuantity } = useCart();
  const { products } = useProducts(initialProducts);

  const handleAddToCart = (product: any) => {
    if (product.quantity > 0) {
      addToCart(product);
      updateQuantity(product.id, -1);
    }
  };

  const handleRemove = (id: string) => {
    updateQuantity(id, -1); // change를 -1로 강제
  };

  return (
    <div className={UI_CLASSES.CONTAINER}>
      <h1 className={UI_CLASSES.HEADING}>{UI_TEXT.CART_TITLE}</h1>
      <ProductList products={products} onProductSelect={handleAddToCart} />
      <div>
        {cart.items.map((item) => (
          <CartItem
            key={item.id}
            item={item}
            onQuantityChange={updateQuantity}
            onRemove={(id) => handleRemove(id)}
          />
        ))}
      </div>
      <CartSummary totalAmount={cart.totalAmount} points={cart.bonusPoints} />
      <StockStatus products={products} />
    </div>
  );
};
