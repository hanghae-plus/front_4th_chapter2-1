interface ShoppingCartItemProps {
  name: string;
  price: number;
  quantity: number;
}

const ShoppingCartItem = ({ name, price, quantity }: ShoppingCartItemProps) => {
  return (
    <div className="space-y-4 mb-6">
      <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
        <span className="flex-1">
          {name} - {price}원 x {quantity}
        </span>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">-</button>
          <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">+</button>
          <button className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">삭제</button>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCartItem;
