import Product from '../types/product.ts';

interface SelectProps {
  productList: Product[];
  selectedProductId: string;
  handleChangeSelectedProduct: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const Select = ({ productList, selectedProductId, handleChangeSelectedProduct }: SelectProps) => {
  return (
    <select
      id='product-select'
      className='border rounded p-2 mr-2'
      value={selectedProductId}
      onChange={handleChangeSelectedProduct}
    >
      {productList.map((product) => (
        <option key={product.id} value={product.id} disabled={product.quantity === 0}>
          {product.name} - {product.price}원
        </option>
      ))}
    </select>
  );
};

export default Select;
