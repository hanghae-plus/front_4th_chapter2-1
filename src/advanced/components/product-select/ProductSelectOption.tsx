import { ProductType } from 'src/advanced/types/ProductsType';

interface Props {
  product: ProductType;
}
export default function ProductSelectOption({ product }: Props) {
  return (
    <option value={product.id} disabled={product.quantity === 0} title={product.name}>
      {product.name} - {product.price}원
    </option>
  );
}
