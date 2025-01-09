import { useCart } from "../hooks/useCart";
import { CartList } from "./Cart/CartList";
import { CartTotal } from "./Cart/CartTotal";
import { ProductSelect } from "./Product/ProductSelect";
import { StockInfo } from "./Product/StockInfo";

export function App() {
  const { products, cartItems, addToCart, updateQuantity, getTotal } =
    useCart();
  const cartResult = getTotal();

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-8">
      <h1 className="text-2xl font-bold mb-4">장바구니</h1>

      <ProductSelect products={products} onSelect={addToCart} />

      <CartList
        items={cartItems}
        products={products}
        onQuantityChange={updateQuantity}
        onRemove={(id) => updateQuantity(id, -9999)}
      />

      <CartTotal
        total={cartResult.total}
        discountRate={cartResult.discountRate}
      />

      <StockInfo products={products} />
    </div>
  );
}
