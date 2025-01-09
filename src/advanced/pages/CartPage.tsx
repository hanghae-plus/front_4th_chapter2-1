import { CartItems } from '../components/CartItems';
import { CartTotal } from '../components/CartTotal';
import { ProductSelect } from '../components/ProductSelect';
import { Layout } from '../layout/Layout';

export const CartPage = () => {
  return (
    <Layout title='장바구니'>
      <CartItems />
      <CartTotal />
      <ProductSelect />
    </Layout>
  );
};
