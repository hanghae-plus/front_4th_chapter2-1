import { FunctionComponent, useState } from "react";
import { PRODUCT_LIST } from "./data/prodList";
import { ICart, IProduct } from "./types/types";
import CartList from "./components/Cart";
import ProductSelect from "./components/ProductSelect";
import SummaryStock from "./components/SummaryStock";

export const App: FunctionComponent = () => {
  const [products, setProducts] = useState<IProduct[]>(PRODUCT_LIST);
  const [selectedProducts, setSelectedProducts] = useState<ICart[]>([
    { id: "p1", name: "상품1", cost: 10000, count: 5, discount: 0.1 },
  ]);
  return (
    <div className="bg-gray-100 p-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
        <h1 className="text-2xl font-bold mb-4">장바구니</h1>
        <CartList products={selectedProducts} />
        <ProductSelect products={products} handler={() => {}} />
        <SummaryStock products={products} />
      </div>
    </div>
  );
};
