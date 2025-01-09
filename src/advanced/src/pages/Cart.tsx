import CartList from '../components/cart/CartList';
import CartSummary from '../components/cart/CartSummary';
import ProductSelector from '../components/cart/ProductSelector';
import StockInfo from '../components/cart/StockInfo';

function Cart() {
  return (
    <div id="wrap" className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
      <h1 className="text-2xl font-bold mb-4">장바구니</h1>
      <CartList />
      <CartSummary />
      <ProductSelector />
      <StockInfo />
    </div>
  );
}

export default Cart;
