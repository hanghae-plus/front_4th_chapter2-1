import React, { useState, useEffect } from 'react';
import { CartItems, CartTotal } from '../components/CalculateCart';
import { IproductList } from '../type/product';
import CartSelect from '../components/CartSelect';

const initialProducts: IproductList[] = [
  { id: 'p1', name: '상품1', price: 10000, quantity: 50 },
  { id: 'p2', name: '상품2', price: 20000, quantity: 30 },
  { id: 'p3', name: '상품3', price: 30000, quantity: 20 },
  { id: 'p4', name: '상품4', price: 15000, quantity: 0 },
  { id: 'p5', name: '상품5', price: 25000, quantity: 10 },
];

export default function CartPage() {
  const [products, setProducts] = useState<IproductList[]>(initialProducts);
  const addToCart = (productId: string) => {
    const currentProduct = products.find((product) => product.id === productId);
  };
  return (
    <Container className="bg-gray-100 p-8">
      <Wrapper className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
        <Title className="text-2xl font-bold mb-4">장바구니</Title>
        <CartItems />
        <CartTotal />
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
