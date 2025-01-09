import { ProductListType, ProductType } from 'src/advanced/types/ProductType';
import CartItem from '../cart-item/CartItem';

interface Props {
  productList: ProductListType;
  handleIncrease: (productId: string, productQuantity: number) => void;
  handleDecrease: (productId: string, productQuantity: number) => void;
  handleRemove: (productId: string) => void;
}
export default function Cart({ productList, handleIncrease, handleDecrease, handleRemove }: Props) {
  return (
    <div id='cart-items'>
      {productList.map((product: ProductType) => (
        <CartItem
          key={product.id}
          product={product}
          handleDecrease={handleDecrease}
          handleIncrease={handleIncrease}
          handleRemove={handleRemove}
        />
      ))}
    </div>
  );
}
