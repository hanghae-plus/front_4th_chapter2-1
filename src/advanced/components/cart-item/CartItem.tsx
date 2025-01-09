import { ProductType } from 'src/advanced/types/ProductType';

interface Props {
  product: ProductType;
  handleIncrease: (productId: string, productQuantity: number) => void;
  handleDecrease: (productId: string, productQuantity: number) => void;
  handleRemove: (productId: string) => void;
}
export default function CartItem({ product, handleIncrease, handleDecrease, handleRemove }: Props) {
  return (
    <div className='flex items-center justify-between mb-2'>
      <span>
        {product.name} - {product.price}원 x {product.quantity}
      </span>
      <div>
        <button
          className='px-2 py-1 mr-1 text-white bg-blue-500 rounded quantity-change'
          data-product-id={product.id}
          data-change='-1'
          onClick={() => handleDecrease(product.id, product.quantity)}
        >
          -
        </button>
        <button
          className='px-2 py-1 mr-1 text-white bg-blue-500 rounded quantity-change'
          data-product-id={product.id}
          data-change='1'
          onClick={() => handleIncrease(product.id, product.quantity)}
        >
          +
        </button>
        <button
          className='px-2 py-1 text-white bg-red-500 rounded remove-item'
          data-product-id={product.id}
          onClick={() => handleRemove(product.id)}
        >
          삭제
        </button>
      </div>
    </div>
  );
}
