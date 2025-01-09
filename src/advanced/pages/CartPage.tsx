import { CartItems } from '../components/CartItems';
import { Layout } from '../layout/Layout';

export const CartPage = () => {
  return (
    <Layout title='장바구니'>
      <CartItems />
    </Layout>
  );
};
