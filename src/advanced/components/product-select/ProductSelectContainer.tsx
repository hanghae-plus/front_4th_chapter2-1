import { ChangeEvent } from 'react';
import { useProduct } from '../../context/ProductContext';
import ProductSelect from './ProductSelect';

export default function ProductSelectContainer() {
  const { setLastSelectedItem, productList } = useProduct();
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const productId = e.target.value;
    setLastSelectedItem(productId);
  };

  return <ProductSelect productList={productList} handleChange={handleChange} />;
}
