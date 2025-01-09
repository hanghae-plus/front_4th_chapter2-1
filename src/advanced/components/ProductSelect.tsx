import { useEffect, useRef, useState } from 'react';

import { useCartItemsStore } from '../store/useCartStore';
import type { ProductType } from '../store/useProductsStore';
import { useProductsStore } from '../store/useProductsStore';

export const ProductSelect = () => {
  const { products, decreaseStock, suggestPrice } = useProductsStore();
  const { cartItems, addItem, increaseQuantity } = useCartItemsStore();

  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    () => products[0].id
  );
  const lastAddProduct = useRef<ProductType | null>(null);

  const handleAddButtonClick = () => {
    const selectedProduct = products.find((product) => {
      return product.id === selectedProductId;
    });
    if (!selectedProduct) {
      alert('상품이 등록되지 않았습니다');
      return;
    }
    if (selectedProduct.stock === 0) {
      alert('재고가 부족합니다');
      return;
    }

    const cartItem = cartItems.find((item) => {
      return item.id === selectedProductId;
    });

    if (cartItem) {
      increaseQuantity(selectedProduct.id);
      decreaseStock(selectedProduct.id);
    } else {
      addItem({
        id: selectedProduct.id,
        name: selectedProduct.name,
        price: selectedProduct.price,
        quantity: 1,
      });
      decreaseStock(selectedProduct.id);
    }

    lastAddProduct.current = selectedProduct;
  };

  const isTimeoutRegistered = useRef(false);
  useEffect(() => {
    if (!isTimeoutRegistered.current) {
      isTimeoutRegistered.current = true;

      setTimeout(() => {
        setInterval(() => {
          let suggest = lastAddProduct.current;
          if (suggest && suggest.stock > 0) {
            alert(
              suggest.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!'
            );
            suggestPrice(suggest.id);
          }
        }, 60000);
      }, Math.random() * 20000);
    }
  }, [suggestPrice]);

  return (
    <>
      <select
        className='mr-2 rounded border p-2'
        onChange={(e) => setSelectedProductId(e.target.value)}
      >
        {products.map((product) => {
          return (
            <option
              key={product.id}
              value={product.id}
              disabled={product.stock === 0}
            >
              {product.name} - {product.price}원
            </option>
          );
        })}
      </select>
      <AddButton onClick={handleAddButtonClick} />
    </>
  );
};

interface AddButtonProps {
  onClick: () => void;
}

export const AddButton = ({ onClick }: AddButtonProps) => {
  return (
    <button
      className='rounded bg-blue-500 px-4 py-2 text-white'
      onClick={onClick}
    >
      추가
    </button>
  );
};
