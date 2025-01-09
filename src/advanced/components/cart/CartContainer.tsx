import { useState } from 'react';
import { ProductListType } from '../../types/ProductsType';
import Cart from './Cart';

export default function CartContainer() {
  const [productList, setProductList] = useState<ProductListType>([]);
  const handleClick = () => {};

  return <Cart productList={productList} handleClick={handleClick} />;
}
