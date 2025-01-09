import Product from '../types/product.ts';

interface CartItemProps {
  product: Product;
  handleClickIncreaseQuantity: (productId: string) => void;
  handleClickDecreaseQuantity: (productId: string) => void;
  handleClickRemoveFromCart: (productId: string) => void;
}

const CartItem = ({
                    product,
                    handleClickIncreaseQuantity,
                    handleClickDecreaseQuantity,
                    handleClickRemoveFromCart,
                  }: CartItemProps) => {
  return (
    <div key={product.id} id={product.id}
         className="flex justify-between items-center mb-2">
              <span>
                {product.name} - {product.price}원 x {product.quantity}
              </span>
      <div>
        <button
          className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
          data-product-id={product.id}
          data-change="-1"
          onClick={(e) => handleClickDecreaseQuantity(e.currentTarget.dataset.productId!)}
        >
          -
        </button>
        <button
          className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
          data-product-id={product.id}
          data-change="1"
          onClick={(e) => handleClickIncreaseQuantity(e.currentTarget.dataset.productId!)}
        >
          +
        </button>
        <button
          className="remove-item bg-red-500 text-white px-2 py-1 rounded"
          data-product-id={product.id}
          onClick={(e) => handleClickRemoveFromCart(e.currentTarget.dataset.productId!)}
        >
          삭제
        </button>
      </div>
    </div>
  );
};

export default CartItem;
