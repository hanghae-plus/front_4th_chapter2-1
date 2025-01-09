import { useState } from 'react';
import { ICartItem, IProduct } from '../type/product';
import { calculateCart } from '../components/CalculateCart';
import CartSelect from '../components/CartSelect';
import Cart from '../components/Cart';
import CartTotal from '../components/CartTotal';

const initialProducts: IProduct[] = [
  { id: 'p1', name: '상품1', price: 10000, quantity: 50 },
  { id: 'p2', name: '상품2', price: 20000, quantity: 30 },
  { id: 'p3', name: '상품3', price: 30000, quantity: 20 },
  { id: 'p4', name: '상품4', price: 15000, quantity: 0 },
  { id: 'p5', name: '상품5', price: 25000, quantity: 10 },
];

export default function CartPage() {
  const [products, setProducts] = useState<IProduct[]>(initialProducts);
  const [cartItems, setCartItems] = useState<ICartItem[]>([]);

  const addToCart = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (!product || product.quantity <= 0) {
      alert('재고가 부족합니다.');
      return;
    }

    // Add product to cart
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.product.id === productId);
      if (existingItem) {
        return prev.map((item) =>
          item.product.id === productId
            ? { ...item, product: { ...item.product, quantity: item.product.quantity - 1 }, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });

    // Decrease product stock
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, quantity: p.quantity - 1 } : p
      )
    );
  };

  const handleChangeQuantity = (productId: string, change: number) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity + change }
            : item
        )
        .filter((item) => item.quantity > 0)
    );

    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? { ...p, quantity: p.quantity - change }
          : p
      )
    );
  };

  const handleRemoveItem = (productId: string) => {
    const removedItem = cartItems.find((item) => item.product.id === productId);
    if (removedItem) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === productId
            ? { ...p, quantity: p.quantity + removedItem.quantity }
            : p
        )
      );
    }
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const { totalAmount, discountRate, loyaltyPoints } = calculateCart(cartItems, products);

  return (
    <Container className="bg-gray-100 p-8">
      <Wrapper className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
        <Title className="text-2xl font-bold mb-4">장바구니</Title>
        <Cart
          cartItems={cartItems}
          onChangeQuantity={handleChangeQuantity}
          onRemoveItem={handleRemoveItem}
        />
        <CartTotal
          totalAmount={totalAmount}
          discountRate={discountRate}
          loyaltyPoints={loyaltyPoints}
        />
        <CartSelect products={products} addToCart={addToCart} />
      </Wrapper>
    </Container>
  );
}

type TComponentProps = {
  children?: React.ReactNode;
  className?: string;
};

const Container = ({ children, className }: TComponentProps) => {
  return <div className={className}>{children}</div>;
};

const Wrapper = ({ children, className }: TComponentProps) => {
  return <div className={className}>{children}</div>;
};

const Title = ({ children, className }: TComponentProps) => {
  return <h1 className={className}>{children}</h1>;
};