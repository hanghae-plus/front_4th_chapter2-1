import type { Product } from '../types/product.type';

type ProductSelectProps = {
  products: Product[];
  onSelect: (productId: string) => void;
};

export const ProductSelect = ({ products, onSelect }: ProductSelectProps) => {
  const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedItemId = event.target.value;

    onSelect(selectedItemId);
  };

  return (
    <select id="product-select" className="border rounded p-2 mr-2" onChange={handleSelect}>
      {products.map((product) => (
        <ProductSelectItem key={product.id} product={product} />
      ))}
    </select>
  );
};

type ProductSelectItemProps = {
  product: Product;
};

const ProductSelectItem = ({ product }: ProductSelectItemProps) => {
  return (
    <option value={product.id}>
      {product.name} - {product.originalPrice}원
    </option>
  );
};
