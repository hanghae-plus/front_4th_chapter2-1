import { Product } from '../type/type';

export const CartItem = ({
  addedItem,
  setCartItems,
  setProducts,
}: {
  addedItem: Product;
  setCartItems: React.Dispatch<React.SetStateAction<Product[]>>;
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}) => {
  const handleAddButton = () => {
    setCartItems((prev) => {
      return prev.map((item) =>
        item.id === addedItem.id ? { ...item, quantity: item.quantity + 1 } : item,
      );
    });

    setProducts((prev) => {
      return prev.map((item) =>
        item.id === addedItem.id ? { ...item, quantity: item.quantity - 1 } : item,
      );
    });
  };

  const handleMinusButton = () => {
    if (addedItem.quantity <= 1) return;

    setCartItems((prev) => {
      return prev.map((item) =>
        item.id === addedItem.id ? { ...item, quantity: item.quantity - 1 } : item,
      );
    });

    setProducts((prev) => {
      return prev.map((item) =>
        item.id === addedItem.id ? { ...item, quantity: item.quantity + 1 } : item,
      );
    });
  };

  const handleRemoveButton = () => {
    if (addedItem.quantity <= 1) return;

    setCartItems((prev) => {
      return prev.filter((item) => item.id !== addedItem.id);
    });

    setProducts((prev) => {
      const item = prev.find((item) => item.id === addedItem.id);
      if (item) {
        return [
          ...prev.filter((item) => item.id !== addedItem.id),
          { ...item, quantity: item.quantity + addedItem.quantity },
        ];
      }
      return prev;
    });
  };

  return (
    <div id='cart-item' className='flex justify-between items-center mb-2'>
      <span>
        {addedItem.name} - {addedItem.price}원 x {addedItem.quantity}
      </span>

      <div className='flex items-center'>
        <button
          className={`quantity-decrease-${addedItem.id} bg-blue-500 text-white px-2 py-1 rounded mr-1`}
          onClick={handleMinusButton}
        >
          -
        </button>
        <button
          data-testid={`quantity-increase-${addedItem.id}`}
          onClick={handleAddButton}
          className={`quantity-increase-${addedItem.id} bg-blue-500 text-white px-2 py-1 rounded mr-1`}
        >
          +
        </button>
        <button
          className='remove-item bg-red-500 text-white px-2 py-1 rounded'
          onClick={handleRemoveButton}
        >
          삭제
        </button>
      </div>
    </div>
  );
};
