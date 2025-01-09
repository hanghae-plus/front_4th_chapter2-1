import React, { useState } from "react";
import Cart from "./components/Cart";
import { INITIAL_PRODUCT_LIST } from "./constants";
import { Product } from "./types";

const App: React.FC = () => {
  const [productList, setProductList] = useState<Product[]>(INITIAL_PRODUCT_LIST);

  return (
    <div className="container mx-auto p-4">
      <Cart productList={productList} setProductList={setProductList} />
    </div>
  );
};

export default App;
