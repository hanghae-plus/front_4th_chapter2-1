interface Product {
  id: string;
  name: string;
  val: number;
  q: number;
}

interface SelectOptionProps {
  product: Product;
}

export const SelectOption = ({ product }: SelectOptionProps) => {
  const isDisabled = product.q === 0;

  return (
    <option id={product.id} value={product.id} disabled={isDisabled}>
      {product.name} - {product.val}원
    </option>
  );
};
