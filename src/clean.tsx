
import React, { useState, useEffect } from 'react';

// types.ts
interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

interface CartItem {
  productId: string;
  quantity: number;
}

// constants.ts
const BULK_DISCOUNT_THRESHOLD = 30;
const BULK_DISCOUNT_RATE = 0.25;
const TUESDAY_DISCOUNT_RATE = 0.1;
const ITEM_DISCOUNT_RATES: Record<string, number> = {
  p1: 0.1,
  p2: 0.15,
  p3: 0.2,
  p4: 0.05,
  p5: 0.25,
};
const LIGHTNING_SALE_RATE = 0.2;
const ALTERNATE_ITEM_DISCOUNT_RATE = 0.05;

// initialData.ts
const initialProducts: Product[] = [
  { id: 'p1', name: '상품1', price: 10000, stock: 50 },
  { id: 'p2', name: '상품2', price: 20000, stock: 30 },
  { id: 'p3', name: '상품3', price: 30000, stock: 20 },
  { id: 'p4', name: '상품4', price: 15000, stock: 0 },
  { id: 'p5', name: '상품5', price: 25000, stock: 10 },
];

// hooks/useCart.ts

export const useCart = (initialProducts: Product[]) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [lastSelectedItem, setLastSelectedItem] = useState<string | null>(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [bonusPoints, setBonusPoints] = useState(0);

  const calculateItemDiscount = (productId: string, quantity: number, itemTotal: number): number => {
    const discountRate = quantity >= 10 ? ITEM_DISCOUNT_RATES[productId] || 0 : 0;
    return itemTotal * (1 - discountRate);
  };

  const calculateTotalDiscountRate = (subTotal: number, totalItems: number): number => {
    let discountRate = 0;
    let finalAmount = subTotal;

    if (totalItems >= BULK_DISCOUNT_THRESHOLD) {
      const bulkDiscount = subTotal * BULK_DISCOUNT_RATE;
      const itemDiscount = cart.reduce((acc, item) => {
        const product = products.find(p => p.id === item.productId);
        if (!product) return acc;
        const itemTotal = product.price * item.quantity;
        return acc + (itemTotal - calculateItemDiscount(item.productId, item.quantity, itemTotal));
      }, 0);

      if (bulkDiscount > itemDiscount) {
        finalAmount = subTotal * (1 - BULK_DISCOUNT_RATE);
        discountRate = BULK_DISCOUNT_RATE;
      } else {
        finalAmount = subTotal - itemDiscount;
        discountRate = itemDiscount / subTotal;
      }
    }

    if (new Date().getDay() === 2) {
      finalAmount *= (1 - TUESDAY_DISCOUNT_RATE);
      discountRate = Math.max(discountRate, TUESDAY_DISCOUNT_RATE);
    }

    setTotalAmount(finalAmount);
    return discountRate;
  };

  const addToCart = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product || product.stock === 0) return;

    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.productId === productId);
      if (existingItem) {
        return prevCart.map(item => 
          item.productId === productId 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { productId, quantity: 1 }];
    });

    setProducts(prevProducts =>
      prevProducts.map(p =>
        p.id === productId ? { ...p, stock: p.stock - 1 } : p
      )
    );

    setLastSelectedItem(productId);
  };

  const updateQuantity = (productId: string, change: number) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    setCart(prevCart => {
      const updatedCart = prevCart.map(item => {
        if (item.productId === productId) {
          const newQuantity = item.quantity + change;
          if (newQuantity <= 0) return null;
          if (change > 0 && product.stock === 0) return item;
          return { ...item, quantity: newQuantity };
        }
        return item;
      }).filter((item): item is CartItem => item !== null);

      return updatedCart;
    });

    setProducts(prevProducts =>
      prevProducts.map(p =>
        p.id === productId ? { ...p, stock: p.stock - change } : p
      )
    );
  };

  const removeFromCart = (productId: string) => {
    const cartItem = cart.find(item => item.productId === productId);
    if (!cartItem) return;

    setProducts(prevProducts =>
      prevProducts.map(p =>
        p.id === productId ? { ...p, stock: p.stock + cartItem.quantity } : p
      )
    );

    setCart(prevCart => prevCart.filter(item => item.productId !== productId));
  };

  useEffect(() => {
    const calculateTotals = () => {
      const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
      const subTotal = cart.reduce((sum, item) => {
        const product = products.find(p => p.id === item.productId);
        return sum + (product?.price || 0) * item.quantity;
      }, 0);

      const discountRate = calculateTotalDiscountRate(subTotal, totalItems);
      setBonusPoints(Math.floor(totalAmount / 1000));
    };

    calculateTotals();
  }, [cart, products]);

  return {
    products,
    cart,
    totalAmount,
    bonusPoints,
    addToCart,
    updateQuantity,
    removeFromCart,
  };
};

export const ShoppingCart: React.FC = () => {
  const {
    products,
    cart,
    totalAmount,
    bonusPoints,
    addToCart,
    updateQuantity,
    removeFromCart,
  } = useCart(initialProducts);

  const getLowStockProducts = () => {
    return products
      .filter(product => product.stock < 5)
      .map(product => ({
        name: product.name,
        status: product.stock > 0 ? `재고 부족 (${product.stock})` : '품절'
      }));
  };

  return (
    <div className="bg-gray-100 p-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
        <h1 className="text-2xl font-bold mb-4">장바구니</h1>
        
        {/* Cart Items */}
        <div className="space-y-2">
          {cart.map(item => {
            const product = products.find(p => p.id === item.productId);
            if (!product) return null;
            
            return (
              <div key={item.productId} className="flex justify-between items-center">
                <span>{product.name} - {product.price}원 x {item.quantity}</span>
                <div>
                  <button
                    onClick={() => updateQuantity(item.productId, -1)}
                    className="bg-blue-500 text-white px-2 py-1 rounded mr-1"
                  >
                    -
                  </button>
                  <button
                    onClick={() => updateQuantity(item.productId, 1)}
                    className="bg-blue-500 text-white px-2 py-1 rounded mr-1"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeFromCart(item.productId)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    삭제
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Total Amount and Points */}
        <div className="text-xl font-bold my-4">
          총액: {Math.round(totalAmount)}원
          <span className="text-blue-500 ml-2">(포인트: {bonusPoints})</span>
        </div>

        {/* Product Selection */}
        <select
          className="border rounded p-2 mr-2"
          onChange={(e) => addToCart(e.target.value)}
        >
          <option value="">상품 선택</option>
          {products.map(product => (
            <option
              key={product.id}
              value={product.id}
              disabled={product.stock === 0}
            >
              {product.name} - {product.price}원
            </option>
          ))}
        </select>

        {/* Stock Status */}
        <div className="text-sm text-gray-500 mt-2">
          {getLowStockProducts().map(({ name, status }) => (
            <div key={name}>{name}: {status}</div>
          ))}
        </div>
      </div>
    </div>
  );
};


