import { NO_STOCK } from '../../constants';
import { useProduct } from '../../context/ProductContext';
import Cart from './Cart';

export default function CartContainer() {
  const { cartList, productList, increaseCartItem, decreaseCartItem, removeCartItem } =
    useProduct();

  return (
    <Cart
      productList={cartList}
      handleIncrease={(id) => {
        const stockQuantity = productList.find((product) => product.id === id)?.quantity || 0;
        if (stockQuantity === 0) {
          alert(NO_STOCK);
          return;
        }
        increaseCartItem(id);
      }}
      handleDecrease={(id) => {
        const cartQuantity = cartList.find((product) => product.id === id)?.quantity || 0;
        if (cartQuantity <= 1) {
          removeCartItem(id);
          return;
        }
        decreaseCartItem(id);
      }}
      handleRemove={removeCartItem}
    />
  );
}
