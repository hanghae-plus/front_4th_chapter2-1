import { useCallback } from 'react';
import { productList } from '../constant/product';
import { useCartContext } from '../hook/useCartContext';

const CartDisplay = () => {
  const { cart, setCart, setIsDisplayBonusPoint } = useCartContext();

  const handleRemoveItem = useCallback((productId: string) => {
    const updatedCart = { ...cart };
    const productIndex = updatedCart.cartDisplay.findIndex(
      (item) => item.id === productId
    );
    if (productIndex !== -1) {
      updatedCart.cartDisplay.splice(productIndex, 1);
      productList.forEach((product) => {
        if (product.id === productId) product.qty++;
      });
      setCart(updatedCart);
    }
  }, []);

  const handleQuantityChange = useCallback(
    (productId: string, change: number) => {
      const updatedCart = { ...cart };
      const product = productList.find((product) => product.id === productId);
      const cartItem = updatedCart.cartDisplay.find(
        (item) => item.id === productId
      );

      if (product && cartItem) {
        const newQty = cartItem.qty + change;
        if (newQty <= product.qty + cartItem.qty && newQty > 0) {
          cartItem.qty = newQty;
          product.qty -= change;
          setCart(updatedCart);
        } else {
          alert('재고가 부족합니다.');
        }
      }
      setIsDisplayBonusPoint(true);
    },

    []
  );

  return (
    <div id="cart-items">
      {cart.cartDisplay.map((item) => (
        <div
          key={item.id}
          id={item.id}
          className="flex justify-between items-center mb-2"
        >
          <span>
            {item.name} - {item.price}원 x {item.qty}
          </span>
          <div>
            <button
              className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
              onClick={() => handleQuantityChange(item.id, -1)}
            >
              -
            </button>
            <button
              className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
              onClick={() => handleQuantityChange(item.id, 1)}
            >
              +
            </button>
            <button
              className="remove-item bg-red-500 text-white px-2 py-1 rounded"
              onClick={() => handleRemoveItem(item.id)}
            >
              삭제
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
export default CartDisplay;
