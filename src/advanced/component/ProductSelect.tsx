import { useCallback, useState } from 'react';
import { productList } from '../constant/product';
import { useCartContext } from '../hook/useCartContext';
import { useCartService } from '../hook/useCartService';
import { Cart } from '../interface/cart';

const ProductSelect = () => {
  const { cart, setCart, setIsDisplayBonusPoint } = useCartContext();
  const { addCartProduct } = useCartService();

  const [selectProduct, setSelectProduct] = useState<string>();

  const handleAddCartProduct = useCallback(() => {
    const addProduct = productList.find(
      (product) => product.id === selectProduct
    );

    if (addProduct && addProduct.qty > 0) {
      const updatedCart: Cart = { ...cart };
      addCartProduct(updatedCart, addProduct);
      setCart(updatedCart);
    } else {
      alert('재고가 부족합니다.');
    }
    setIsDisplayBonusPoint(false);
  }, []);

  const handleChangeSelectProduct = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectProduct(e.target.value);
    },
    []
  );

  return (
    <>
      <select
        id="product-select"
        className="border rounded p-2 mr-2"
        onChange={handleChangeSelectProduct}
      >
        {productList.map((product) => (
          <option
            key={product.id}
            value={product.id}
            disabled={product.qty === 0}
          >
            {product.name} - {product.price}원
          </option>
        ))}
      </select>
      <button
        id="add-to-cart"
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={handleAddCartProduct}
      >
        추가
      </button>
    </>
  );
};

export default ProductSelect;
