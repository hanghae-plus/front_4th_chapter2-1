import { useEffect, useState } from 'react';
import { Fragment } from 'react/jsx-runtime';
import { useCartContext } from '../../context/CartContext';
import { Item } from '../../types';
import { calculateCartSummary } from '../../utils/calculateCartSummary';

function ProductSelector() {
  const { productList, cartList, updateProductList, updateCartList, updateTotalAmount, updateDiscountRate } = useCartContext();

  const [selectedId, setSelectedId] = useState<string>(productList[0]?.id || '');

  const handleAddToCart = () => {
    const product = productList.find((item) => item.id === selectedId);
    if (!product) return;

    if (isOutOfStock(product)) {
      alert('재고가 부족합니다.');
      return;
    }

    updateProductStock(product);
    updateCartItems(product);
  };

  const isOutOfStock = (product: Item) => product.volume === 0;

  const updateProductStock = (product: Item) => {
    const updatedProducts = productList.map((p) => (p.id === product.id ? { ...p, volume: p.volume - 1 } : p));
    updateProductList(updatedProducts);
  };

  const updateCartItems = (product: Item) => {
    const existingCartItem = cartList.find((item) => item.id === product.id);

    if (!existingCartItem) {
      updateCartList([
        ...cartList,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          volume: 1
        }
      ]);
    } else {
      const updatedCarts = cartList.map((item) => (item.id === product.id ? { ...item, volume: item.volume + 1 } : item));
      updateCartList(updatedCarts);
    }
  };

  useEffect(() => {
    const { totalAmount, totalDiscountRate } = calculateCartSummary(cartList);
    updateTotalAmount(totalAmount);
    updateDiscountRate(totalDiscountRate);
  }, [cartList]);

  return (
    <Fragment>
      <select id="product-select" className="border rounded p-2 mr-2" value={selectedId} onChange={(e) => setSelectedId(e.target.value)}>
        {productList.map((product) => (
          <option key={product.id} value={product.id} disabled={isOutOfStock(product)}>
            {product.name} - {product.price}원
          </option>
        ))}
      </select>
      <button id="add-to-cart" className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleAddToCart}>
        추가
      </button>
    </Fragment>
  );
}

export default ProductSelector;
