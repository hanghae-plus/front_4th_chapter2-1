import { ProductListType, ProductType } from 'src/advanced/types/ProductType';
import CartItem from '../cart-item/CartItem';

interface Props {
  productList: ProductListType;
  handleClick: () => void;
}
export default function Cart({ productList, handleClick }: Props) {
  return (
    <div id='cart-items' onClick={handleClick}>
      {productList.map((product: ProductType) => (
        <CartItem product={product} />
      ))}
    </div>
  );
}
