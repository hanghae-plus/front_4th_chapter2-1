import { useState } from 'react';
import { useCartActionsContext } from '../contexts/CartProvider';
import { useOrderActionsContext } from '../contexts/OrderProvider';
import { useProductsStateContext } from '../contexts/ProductsProvider';
import { usePreservedCallback } from '../hooks/usePreservedCallback';

const OrderForm = () => {
  const { products } = useProductsStateContext('OrderForm');
  const { addItem } = useCartActionsContext('OrderForm');
  const { setOrder } = useOrderActionsContext('OrderForm');

  const [productId, setProductId] = useState(products[0].id);

  const handleProductIdChange = usePreservedCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setProductId(e.target.value);
  });

  const handleButtonClick = usePreservedCallback(() => {
    addItem(productId);
    setOrder(productId);
  });

  return (
    <div>
      <select
        id="product-select"
        className="mr-2 rounded border p-2"
        value={productId}
        onChange={handleProductIdChange}
      >
        {products.map(({ id, name, price, stock }, i) => (
          <option key={i} value={id} disabled={stock === 0}>
            {name} - {price}원
          </option>
        ))}
      </select>
      <button
        id="add-to-cart"
        className="rounded bg-blue-500 px-4 py-2 text-white"
        onClick={handleButtonClick}
      >
        추가
      </button>
    </div>
  );
};

export default OrderForm;
