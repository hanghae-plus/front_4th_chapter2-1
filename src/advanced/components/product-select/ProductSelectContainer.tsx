import { initialProductList } from '../../data/initialProductList';
import ProductSelect from './ProductSelect';

export default function ProductSelectContainer() {
  const productList = initialProductList;

  return <ProductSelect productList={productList} />;
}
