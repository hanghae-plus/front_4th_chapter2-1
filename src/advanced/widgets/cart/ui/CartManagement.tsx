import { CartDisplay, CartTotal, useCart } from "@advanced/features/cart";
import { StockStatus } from "@advanced/features/stock";
import { useSelect } from "@advanced/shared/model";
import { Select } from "@advanced/shared/ui";

export function CartManagement() {
  const {
    cart,
    stock,
    handleAddCartItem,
    handleRemoveCartItem,
    handleDeleteCartItem
  } = useCart();

  const stockOptions = stock.map((item) => ({
    value: item.id,
    label: `${item.name} - ${item.cost}원`,
    disabled: item.quantity === 0
  }));

  const { value, onChange } = useSelect(stock[0]?.id);

  const filteredStock = stock.filter((item) => item.quantity < 5);

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
      <h1 className="text-2xl font-bold mb-4">장바구니</h1>
      <CartDisplay
        cart={cart}
        onAdd={handleAddCartItem}
        onRemove={handleRemoveCartItem}
        onDelete={handleDeleteCartItem}
      />
      <CartTotal cart={cart} />
      <Select
        className="border rounded p-2 mr-2"
        options={stockOptions}
        value={value}
        onChange={onChange}
      />
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={() =>
          value && handleAddCartItem(stock.find((item) => item.id === value)!)
        }
      >
        추가
      </button>
      <StockStatus filteredStock={filteredStock} />
    </div>
  );
}
