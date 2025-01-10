import { CartList } from './components/CartList';
import CartTotal from './components/CartTotal';
import { ProductSelect } from './components/ProductSelect';
import { Stock } from './components/Stock';
import { CartStoreProvider } from './stores/CartStore';

const Main = () => {
  return (
    <div className="bg-gray-100 p-8">
      <div className="mx-auto max-w-md overflow-hidden rounded-xl bg-white p-8 shadow-md md:max-w-2xl">
        <h1 className="mb-4 text-2xl font-bold">장바구니</h1>
        <CartStoreProvider>
          <CartList />
          <ProductSelect />
          <CartTotal />
          <Stock />
        </CartStoreProvider>
      </div>
    </div>
  );
};

export default Main;
