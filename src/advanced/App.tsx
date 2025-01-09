import { useState } from 'react';
import ProductSelect from './components/product/ProductSelect';
import { Product } from './types/product';
import { CartItem } from './types/cart';
import AddToCart from './components/cart/AddToCart';
import { PRODUCTS } from './constants/products';
import CartItems from './components/cart/CartItems';
import CartTotal from './components/cart/CartTotal';

const App = () => {
  const [lastSelectedProduct, setLastSelectedProduct] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(PRODUCTS[0].id);
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const handleAddToCart = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    // 상품 추가 로직
    setProducts((prevProducts) =>
      prevProducts.map((p) =>
        p.id === productId ? { ...p, stockQuantity: p.stockQuantity - 1 } : p,
      ),
    );

    // 장바구니 업데이트
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.productId === productId);
      if (existingItem) {
        return prevItems.map((item) =>
          item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }
      return [...prevItems, { productId, quantity: 1 }];
    });
  };

  const handleSelectProduct = (productId: string) => {
    setSelectedProduct(productId);
  };

  const handleQuantityChange = (productId: string, change: number) => {
    const product = products.find((p) => p.id === productId);
    const cartItem = cartItems.find((item) => item.productId === productId);

    if (!product || !cartItem) return;

    const newQuantity = cartItem.quantity + change;

    // 수량이 0 이하가 되는 경우
    if (newQuantity <= 0) {
      setCartItems((prev) => prev.filter((item) => item.productId !== productId));
      setProducts((prev) =>
        prev.map((p) =>
          p.id === productId ? { ...p, stockQuantity: p.stockQuantity + cartItem.quantity } : p,
        ),
      );
    }
    // 재고보다 많은 수량을 요청하는 경우
    else if (newQuantity > product.stockQuantity + cartItem.quantity) {
      alert('재고가 부족합니다.');
      return;
    }
    // 정상적인 수량 변경
    else {
      setCartItems((prev) =>
        prev.map((item) =>
          item.productId === productId ? { ...item, quantity: newQuantity } : item,
        ),
      );
      setProducts((prev) =>
        prev.map((p) =>
          p.id === productId ? { ...p, stockQuantity: p.stockQuantity - change } : p,
        ),
      );
    }
  };

  const handleRemoveItem = (productId: string) => {
    const cartItem = cartItems.find((item) => item.productId === productId);
    if (!cartItem) return;

    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, stockQuantity: p.stockQuantity + cartItem.quantity } : p,
      ),
    );
    setCartItems((prev) => prev.filter((item) => item.productId !== productId));
  };

  return (
    <div className='bg-gray-100 p-8'>
      <div className='max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8'>
        <h1 className='text-2xl font-bold mb-4'>장바구니</h1>
        <CartItems
          cartItems={cartItems}
          products={products}
          onQuantityChange={handleQuantityChange}
          onRemoveItem={handleRemoveItem}
        />
        <CartTotal cartItems={cartItems} products={products} />
        <select
          id='product-select'
          className='border rounded p-2 mr-2'
          onChange={(e) => handleSelectProduct(e.target.value)}
        >
          <ProductSelect
            products={products}
            setProducts={setProducts}
            lastSelectedProduct={lastSelectedProduct}
          />
        </select>
        <AddToCart
          selectedProduct={selectedProduct}
          onAddToCart={handleAddToCart}
          products={products}
          setLastSelectedProduct={setLastSelectedProduct}
        />
        <div id='stock-status' className='text-sm text-gray-500 mt-2'></div>
      </div>
    </div>
  );
};

export default App;
