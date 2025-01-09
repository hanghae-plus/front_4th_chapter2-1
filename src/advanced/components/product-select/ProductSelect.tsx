import { ChangeEvent } from 'react';
import { ProductListType } from 'src/advanced/types/ProductType';
import ProductSelectOption from './ProductSelectOption';

interface Props {
  productList?: ProductListType;
  handleChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}
export default function ProductSelect({ productList, handleChange }: Props) {
  return (
    <select
      id='product-select'
      aria-label='제품 선택'
      className='p-2 mr-2 border rounded'
      onChange={handleChange}
    >
      {productList?.map((product) => <ProductSelectOption key={product.id} product={product} />)}
    </select>
  );
}
