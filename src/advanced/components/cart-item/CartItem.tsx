import { ProductType } from 'src/advanced/types/ProductsType';

interface Props {
  product: ProductType;
}
export default function CartItem({ product }: Props) {
  return (
    <>
      <span>
        {product.name} - {product.price}원 x 1
      </span>
      <div>
        <button
          className='quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1'
          data-product-id={product.id}
          data-change='-1'
        >
          -
        </button>
        <button
          className='quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1'
          data-product-id={product.id}
          data-change='1'
        >
          +
        </button>
        <button
          className='remove-item bg-red-500 text-white px-2 py-1 rounded'
          data-product-id={product.id}
        >
          삭제
        </button>
      </div>
    </>
  );
}
