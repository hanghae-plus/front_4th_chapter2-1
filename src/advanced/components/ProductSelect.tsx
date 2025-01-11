import { useCartStore } from '../hooks/useCart';

export const ProductSelect = () => {
  const { productList, addToCart } = useCartStore();

  const handleAddToCartClick = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const currentTarget = new FormData(e.currentTarget);
    const selectedId = currentTarget.get('product-select') as string;

    if (selectedId) {
      addToCart(selectedId);
    }
  };

  return (
    <form onSubmit={(e) => handleAddToCartClick(e)}>
      <select id="product-select" name="product-select" className="mr-2 rounded border p-2">
        {productList.map((product) => (
          <option
            key={product.id}
            id={product.id}
            disabled={product.stock === 0}
            value={product.id}
          >
            {product.name} - {product.price}원
          </option>
        ))}
      </select>
      <button type="submit" id="add-to-cart" className="bg-blue-500 text-white px-4 py-2 rounded">
        추가
      </button>
    </form>
  );
};
