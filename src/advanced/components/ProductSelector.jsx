import React, { useState } from "react";

const ProductSelector = ({ products, onAdd }) => {
  const [selectedProduct, setSelectedProduct] = useState(products[0]?.id || "");

  const handleAdd = () => {
    if (selectedProduct) {
      onAdd(selectedProduct);
    }
  };

  return (
    <div className="flex gap-2">
      <select
        className="flex-1 border rounded p-2"
        value={selectedProduct}
        onChange={(e) => setSelectedProduct(e.target.value)}
      >
        {products.map(product => (
          <option
            key={product.id}
            value={product.id}
            disabled={product.quantity === 0}
          >
            {product.name} - {product.price.toLocaleString()}원
            {product.quantity === 0 ? " (품절)" : ""}
          </option>
        ))}
      </select>
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        onClick={handleAdd}
        disabled={!selectedProduct || products.find(p => p.id === selectedProduct)?.quantity === 0}
      >
        추가
      </button>
    </div>
  );
}

export default ProductSelector;