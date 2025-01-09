import { useRef, useState } from "react";
import { Product } from "../types/product";
import { CartItem } from "../components/CartItem";
import { ProductOption } from "../components/ProductOptions";

const PRODUCTS = [
  { id: "p1", name: "상품1", price: 10000, quantity: 50, discount: 0.1 },
  { id: "p2", name: "상품2", price: 20000, quantity: 30, discount: 0.15 },
  { id: "p3", name: "상품3", price: 30000, quantity: 20, discount: 0.2 },
  { id: "p4", name: "상품4", price: 15000, quantity: 0, discount: 0.05 },
  { id: "p5", name: "상품5", price: 25000, quantity: 10, discount: 0.25 },
];

export function MainPage() {
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [shoppingCart, setShoppingCart] = useState<Product[]>([]);
  const selectProductRef = useRef<HTMLSelectElement | null>(null);

  const addToCartClickHandler = () => {
    const selectedProductId = selectProductRef.current?.value;
    const productToAdd = products.find((prod) => prod.id === selectedProductId);

    if (!(productToAdd && productToAdd.quantity > 0)) {
      alert("재고가 부족합니다.");
      return;
    }

    const existingCartItem = shoppingCart.find((prod) => prod.id === selectedProductId);
    if (existingCartItem) {
      setShoppingCart((prev) =>
        prev.map((prod) => {
          if (prod.id === existingCartItem.id) {
            prod.quantity += 1;
          }
          return prod;
        })
      );
    } else {
      setShoppingCart((prev) => [...prev, { ...productToAdd, quantity: 1 }]);
    }

    setProducts((prev) =>
      prev.map((prod) => {
        if (prod.id === selectedProductId) {
          prod.quantity -= 1;
        }
        return prod;
      })
    );
  };

  return (
    <div id="cont" className="bg-gray-100 p-8">
      <div id="wrap" className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
        <h1 className="text-2xl font-bold mb-4">장바구니</h1>
        <div id="cart-items">
          {shoppingCart.map((item) => (
            <CartItem key={item.id} {...item} />
          ))}
        </div>
        <div id="cart-total" className="text-xl font-bold my-4"></div>
        <select id="product-select" ref={selectProductRef} className="text-xl font-bold my-4">
          {products.map((product) => (
            <ProductOption key={product.id} {...product} />
          ))}
        </select>
        <button id="add-to-cart" className="bg-blue-500 text-white px-4 py-2 rounded" onClick={addToCartClickHandler}>
          추가
        </button>
        <div id="stock-status" className="text-sm text-gray-500 mt-2"></div>
      </div>
    </div>
  );
}
