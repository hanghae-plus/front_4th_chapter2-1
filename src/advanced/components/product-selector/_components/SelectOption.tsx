interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface SelectOptionProps {
  product: Product;
}

export const SelectOption = ({ product }: SelectOptionProps) => {
  const isDisabled = product.quantity === 0;

  return (
    <option id={product.id} value={product.id} disabled={isDisabled}>
      {product.name} - {product.price}원
    </option>
  );
};
