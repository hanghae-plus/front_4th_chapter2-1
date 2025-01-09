import React, { useState, useEffect } from 'react';
import { Product, CartItem, CartTotals } from '../../types';
import ProductSelect from '../ProductSelect';
import CartItemList from '../CartItemList';
import CartSummary from '../CartSummary';
import { usePromotion } from '../../hooks/usePromotion';
import { calculateTotals } from '../../services/cartService';

interface CartProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

const Cart: React.FC<CartProps> = ({ products, setProducts }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [lastSelectedProduct, setLastSelectedProduct] = useState<string | null>(null);
  const [totals, setTotals] = useState<CartTotals>({
    subTotal: 0,
    totalAmount: 0,
    itemCount: 0,
    discount: 0
  });

  usePromotion(products, setProducts, lastSelectedProduct);

  useEffect(() => {
    const newTotals = calculateTotals(cartItems, products);
    setTotals(newTotals);
  }, [cartItems, products]);

  const handleAddToCart = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product || product.stock <= 0) return;

    setProducts(prev => 
      prev.map(p => 
        p.id === productId 
          ? { ...p, stock: p.stock - 1 }
          : p
      )
    );

    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === productId);
      if (existingItem) {
        return prev.map(item =>
          item.id === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { id: productId, quantity: 1 }];
    });

    setLastSelectedProduct(productId);
  };

  const handleUpdateQuantity = (productId: string, change: number) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    if (change > 0 && product.stock <= 0) {
      alert("재고가 부족합니다.");
      return;
    }

    setProducts(prev =>
      prev.map(p =>
        p.id === productId
          ? { ...p, stock: p.stock - change }
          : p
      )
    );

    setCartItems(prev => {
      const updatedItems = prev.map(item =>
        item.id === productId
          ? { ...item, quantity: item.quantity + change }
          : item
      ).filter(item => item.quantity > 0);

      return updatedItems;
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">장바구니</h1>
      <ProductSelect
        products={products}
        onAddToCart={handleAddToCart}
      />
      <CartItemList
        items={cartItems}
        products={products}
        onUpdateQuantity={handleUpdateQuantity}
      />
      <CartSummary totals={totals} />
    </div>
  );
};

export default Cart;