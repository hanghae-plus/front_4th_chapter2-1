import { useProductsStore } from '../store/useProductsStore';

export const ProductSelect = () => {
  const { products } = useProductsStore();

  return (
    <select className='mr-2 rounded border p-2'>
      {products.map((product) => {
        return (
          <option value={product.id} disabled={product.stock === 0}>
            {product.name} - {product.price}원
          </option>
        );
      })}
    </select>
  );
};
