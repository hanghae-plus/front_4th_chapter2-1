import { CartTotal } from "./components/CartTotal";
import { CartNewItem } from "./components/CartNewItem";
import { ProductOptions } from "./components/ProductOptions";
import { StockStatus } from "./components/StockStatus";
import { useCartContext } from "./hooks/useCartContext";

function Main() {
  const { cartState } = useCartContext();

  return (
    <div className="bg-gray-100 p-8">
      <div className="mx-auto max-w-md overflow-hidden rounded-xl bg-white p-8 shadow-md md:max-w-2xl">
        <h1 className="mb-4 text-2xl font-bold">장바구니</h1>
        {cartState.items.map((product, idx) => (
          <CartNewItem key={product.id + idx} product={product} />
        ))}
        <CartTotal />
        <ProductOptions />
        <StockStatus />
      </div>
    </div>
  );
}

export default Main;
