import { PRODUCT_LIST } from '../types/constant';

export const ProductSelect = () => {
  const handleAddProductToCart = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const currentTarget = new FormData(e.currentTarget);
    const selectedId = currentTarget.get('product-select');
    const itemToAdd = PRODUCT_LIST.find((p) => p.id === selectedId);

    if (!itemToAdd) return;
  };

  return (
    <form onSubmit={(e) => handleAddProductToCart(e)}>
      <select id="product-select" name="product-select" className="mr-2 rounded border p-2">
        {PRODUCT_LIST.map((product) => (
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
