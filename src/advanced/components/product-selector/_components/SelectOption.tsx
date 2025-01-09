interface Product {
  id: string;
  name: string;
  amount: number;
  quantity: number;
}

interface SelectOptionProps {
  product: Product;
}

export const SelectOption = ({ product }: SelectOptionProps) => {
  const isDisabled = product.quantity === 0;

  return (
    <option id={product.id} value={product.id} disabled={isDisabled}>
      {product.name} - {product.amount}원
    </option>
  );
};
