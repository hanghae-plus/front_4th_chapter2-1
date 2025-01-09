import { ProductListType } from 'src/advanced/types/ProductsType';
import ProductSelectOption from './ProductSelectOption';

interface Props {
  productList?: ProductListType;
}
export default function ProductSelect({ productList }: Props) {
  return (
    <select id='product-select' aria-label='제품 선택' className='border rounded p-2 mr-2'>
      {productList?.map((product) => <ProductSelectOption key={product.id} product={product} />)}
    </select>
  );
}
