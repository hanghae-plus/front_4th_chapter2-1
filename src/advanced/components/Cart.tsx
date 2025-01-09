import Product from '../types/product.ts';
import StockWrapper from './StockWrapper.tsx';
import Select from './SelectWrapper.tsx';
import TotalPrice from './TotalPrice.tsx';
import CartItem from './CartItem.tsx';
import { ChangeEvent } from 'react';

interface CartProps {
  price: number;
  cartList: Product[];
  productList: Product[];
  discountRate: number;
  selectedProductId: string;
  handleClickAddToCart: (productId: string) => void;
  handleClickRemoveFromCart: (productId: string) => void;
  handleClickIncreaseQuantity: (productId: string) => void;
  handleClickDecreaseQuantity: (productId: string) => void;
  handleChangeSelectedProduct: (e: ChangeEvent<HTMLSelectElement>) => void;
}

const Cart = ({
  price,
  cartList,
  productList,
  discountRate,
  selectedProductId,
  handleClickAddToCart,
  handleClickRemoveFromCart,
  handleClickIncreaseQuantity,
  handleClickDecreaseQuantity,
  handleChangeSelectedProduct,
}: CartProps) => {
  return (
    <div className='bg-gray-100 p-8'>
      <div className='max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8'>
        <h1 className='text-2xl font-bold mb-4'>장바구니</h1>
        <div id='cart-items'>
          {cartList.map((product) => {
            return (
              <CartItem
                product={product}
                handleClickDecreaseQuantity={handleClickDecreaseQuantity}
                handleClickIncreaseQuantity={handleClickIncreaseQuantity}
                handleClickRemoveFromCart={handleClickRemoveFromCart}
              />
            );
          })}
        </div>
        <TotalPrice price={price} discountRate={discountRate} />
        <Select
          productList={productList}
          selectedProductId={selectedProductId}
          handleChangeSelectedProduct={handleChangeSelectedProduct}
        />
        <button
          id='add-to-cart'
          className='bg-blue-500 text-white px-4 py-2 rounded'
          onClick={() => handleClickAddToCart(selectedProductId)}
        >
          추가
        </button>
        <StockWrapper productList={productList} />
      </div>
    </div>
  );
};

export default Cart;
