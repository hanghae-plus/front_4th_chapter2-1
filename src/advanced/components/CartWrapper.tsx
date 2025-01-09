import useCartCalculations from '../hooks/useCartCalculations.tsx';
import Cart from './Cart.tsx';

const CartWrapper = () => {
  const cartCalculations = useCartCalculations();

  return (
    <Cart {...cartCalculations} />
  );
};

export default CartWrapper;
