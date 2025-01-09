import { useCartContext } from '../../context/CartContext';
import { Item } from '../../types';

interface CartItemProps {
  product: Item;
}

type Click = 'plus' | 'minus' | 'remove';

function CartItem({ product }: CartItemProps) {
  const { productList, cartList, updateProductList, updateCartList } = useCartContext();

  const updateCartAndProductLists = (id: string, cartVolumeChange: number, productVolumeChange: number) => {
    const updatedCartList = cartList
      .map((item) => (item.id === id ? { ...item, volume: item.volume + cartVolumeChange } : item))
      .filter((item) => item.volume > 0);

    const updatedProductList = productList.map((item) => (item.id === id ? { ...item, volume: item.volume + productVolumeChange } : item));

    updateCartList(updatedCartList);
    updateProductList(updatedProductList);
  };

  const handleQuantityButtons = (id: string, type: Click) => {
    const selectedProduct = productList.find((item) => item.id === id);
    const selectedCartItem = cartList.find((item) => item.id === id);

    switch (type) {
      case 'plus':
        if (selectedProduct!.volume <= 0) {
          alert('재고가 부족합니다.');
          return;
        }
        updateCartAndProductLists(id, 1, -1);
        break;

      case 'minus':
        updateCartAndProductLists(id, -1, 1);
        break;

      case 'remove':
        if (!selectedCartItem) return;
        updateCartAndProductLists(id, -selectedCartItem.volume, selectedCartItem.volume);
        break;

      default:
        break;
    }
  };

  return (
    <div id={product.id} className="flex justify-between items-center mb-2">
      <span>
        {product.name} - {product.price}원 x {product.volume}
      </span>
      <div>
        <button
          className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
          data-product-id={product.id}
          data-change="-1"
          onClick={() => handleQuantityButtons(product.id, 'minus')}
        >
          -
        </button>
        <button
          className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
          data-product-id={product.id}
          data-change="1"
          onClick={() => handleQuantityButtons(product.id, 'plus')}
        >
          +
        </button>
        <button
          className="remove-item bg-red-500 text-white px-2 py-1 rounded"
          data-product-id={product.id}
          onClick={() => handleQuantityButtons(product.id, 'remove')}
        >
          삭제
        </button>
      </div>
    </div>
  );
}

export default CartItem;
