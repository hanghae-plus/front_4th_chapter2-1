//타입
interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

interface CartItem extends Product {
  quantity: number;
}

//변수 및 상수
export const BULK_DISCOUNT_THRESHOLD = 30;
export const BULK_DISCOUNT_RATE = 0.25;
export const TUESDAY_DISCOUNT_RATE = 0.1;
export const ITEM_DISCOUNT_RATES: Record<string, number> = {
  p1: 0.1,
  p2: 0.15,
  p3: 0.2,
  p4: 0.05,
  p5: 0.25,
};
export const LIGHTNING_SALE_RATE = 0.2;
export const ALTERNATE_ITEM_DISCOUNT_RATE = 0.05;

export const INITIAL_PRODUCTS: Product[] = [
  { id: 'p1', name: '상품1', price: 10000, stock: 50 },
  { id: 'p2', name: '상품2', price: 20000, stock: 30 },
  { id: 'p3', name: '상품3', price: 30000, stock: 20 },
  { id: 'p4', name: '상품4', price: 15000, stock: 0 },
  { id: 'p5', name: '상품5', price: 25000, stock: 10 },
];


import React, { createContext, useContext, useState, useEffect } from 'react';

interface CartContextType {
  cart: CartItem[];
  products: Product[];
  addToCart: (productId: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, change: number) => void;
  totalAmount: number;
  bonusPoints: number;
  lastSelectedItem: string | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [totalAmount, setTotalAmount] = useState(0);
  const [bonusPoints, setBonusPoints] = useState(0);
  const [lastSelectedItem, setLastSelectedItem] = useState<string | null>(null);

  const calculateDiscounts = (items: CartItem[]) => {
    let subTotal = 0;
    let discountedTotal = 0;
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

    items.forEach(item => {
      const itemTotal = item.price * item.quantity;
      subTotal += itemTotal;
      
      // 특정 상품 할인
      const itemDiscount = item.quantity >= 10 ? 
        ITEM_DISCOUNT_RATES[item.id] || 0 : 0;
      discountedTotal += itemTotal * (1 - itemDiscount);
    });

    // 대량 구매 할인 
    if (totalItems >= BULK_DISCOUNT_THRESHOLD) {
      const bulkDiscountTotal = subTotal * (1 - BULK_DISCOUNT_RATE);
      discountedTotal = Math.min(discountedTotal, bulkDiscountTotal);
    }

    // 화요일 할인
    if (new Date().getDay() === 2) {
      discountedTotal *= (1 - TUESDAY_DISCOUNT_RATE);
    }

    return discountedTotal;
  };

  const addToCart = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product || product.stock === 0) return;

    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === productId);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });

    setProducts(prevProducts =>
      prevProducts.map(p =>
        p.id === productId ? { ...p, stock: p.stock - 1 } : p
      )
    );

    setLastSelectedItem(productId);
  };

  const removeFromCart = (productId: string) => {
    const cartItem = cart.find(item => item.id === productId);
    if (!cartItem) return;

    setProducts(prevProducts =>
      prevProducts.map(p =>
        p.id === productId ? { ...p, stock: p.stock + cartItem.quantity } : p
      )
    );

    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, change: number) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    setCart(prevCart => {
      const updatedCart = prevCart.map(item => {
        if (item.id === productId) {
          const newQuantity = item.quantity + change;
          if (newQuantity <= 0) return null;
          if (change > 0 && product.stock < change) return item;
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

  useEffect(() => {
    const total = calculateDiscounts(cart);
    setTotalAmount(total);
    setBonusPoints(Math.floor(total / 1000));
  }, [cart]);

  const value = {
    cart,
    products,
    addToCart,
    removeFromCart,
    updateQuantity,
    totalAmount,
    bonusPoints,
    lastSelectedItem
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};



export const ShoppingCart: React.FC = () => {
  return (
    <>
      <h1 className="text-2xl font-bold mb-4">장바구니</h1>
      <CartItemList />
      <CartSummary />
      <ProductSelect />
    </>
  );
};


export const ProductSelect: React.FC = () => {
  const { products, addToCart } = useCart();

  return (
    <div className="mt-4">
      <select 
        className="border rounded p-2 mr-2"
        onChange={(e) => addToCart(e.target.value)}
        defaultValue=""
      >
        <option value="" disabled>상품을 선택하세요</option>
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
      <button 
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={() => {
          const select = document.querySelector('select');
          if (select) addToCart(select.value);
        }}
      >
        추가
      </button>
    </div>
  );
};


export const CartItemList: React.FC = () => {
  const { cart, updateQuantity, removeFromCart } = useCart();

  return (
    <div className="space-y-2">
      {cart.map(item => (
        <div key={item.id} className="flex justify-between items-center">
          <span>
            {item.name} - {item.price}원 x {item.quantity}
          </span>
          <div>
            <button
              className="bg-blue-500 text-white px-2 py-1 rounded mr-1"
              onClick={() => updateQuantity(item.id, -1)}
            >
              -
            </button>
            <button
              className="bg-blue-500 text-white px-2 py-1 rounded mr-1"
              onClick={() => updateQuantity(item.id, 1)}
            >
              +
            </button>
            <button
              className="bg-red-500 text-white px-2 py-1 rounded"
              onClick={() => removeFromCart(item.id)}
            >
              삭제
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};


export const CartSummary: React.FC = () => {
  const { totalAmount, bonusPoints, products } = useCart();

  return (
    <div className="my-4">
      <div className="text-xl font-bold">
        총액: {Math.round(totalAmount)}원
        <span className="text-blue-500 ml-2">
          (포인트: {bonusPoints})
        </span>
      </div>
      <div className="text-sm text-gray-500 mt-2">
        {products
          .filter(product => product.stock < 5)
          .map(product => (
            <div key={product.id}>
              {product.name}: {product.stock > 0 ? `재고 부족 (${product.stock})` : '품절'}
            </div>
          ))}
      </div>
    </div>
  );
};


const App: React.FC = () => {
  return (
    <CartProvider>
      <div className="bg-gray-100 p-8">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
          <ShoppingCart />
        </div>
      </div>
    </CartProvider>
  );
};

export default App;