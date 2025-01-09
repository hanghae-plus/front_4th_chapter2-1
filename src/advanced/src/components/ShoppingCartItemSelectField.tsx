import { ChangeEvent, MouseEvent, useState } from 'react';

import { useShoppingCart } from '../providers/ShoppingCartProvider.tsx';
import { useInStockProductList } from '../providers/InStockProductListProvider.tsx';

import { Product } from '../types/product';

const ShoppingCartItemSelectField = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const { addOneInCart } = useShoppingCart();
  const { inStockProductList } = useInStockProductList();

  const handleAddOneInCartButtonClick = (_e: MouseEvent<HTMLButtonElement>) => {
    if (!selectedProduct) return;
    addOneInCart(selectedProduct.id);
  };

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedProductId = e.target.value;
    const selectedProduct = inStockProductList.find((product) => product.id === selectedProductId);

    if (!selectedProduct) return;

    setSelectedProduct(selectedProduct);
  };

  return (
    <div className="flex gap-2 mb-6">
      <select onChange={handleSelectChange} className="flex-1 border rounded-lg px-4 py-2 bg-white">
        <option value="">상품을 선택해주세요</option>
        {inStockProductList.map((product) => (
          <option key={`option-${product.id}`} disabled={product.quantity === 0} value={product.id}>
            {product.name} - {product.value.toLocaleString('kr')} {product.quantity === 0 && '(품절)'}
          </option>
        ))}
      </select>
      <button
        onClick={handleAddOneInCartButtonClick}
        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        추가
      </button>
    </div>
  );
};

export default ShoppingCartItemSelectField;
