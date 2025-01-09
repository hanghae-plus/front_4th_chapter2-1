import React, { useState } from "react";
import Cart from "./components/Cart";
import { INITIAL_PRODUCTS } from "./constants";
import { Product } from "./types";

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);

  return (
    <div className="container mx-auto p-4">
      <Cart products={products} setProducts={setProducts} />
    </div>
  );
};

export default App;
