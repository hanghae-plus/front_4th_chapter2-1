import ShoppingCartItem from './ShoppingCartItem.tsx';
import ShoppingCartItemSelectField from './ShoppingCartItemSelectField.tsx';
import ShoppingCartTotalPrice from './ShoppingCartTotalPrice.tsx';
import ShoppingCartStockInfo from './ShoppingCartStockInfo.tsx';
import { useShoppingCart } from '../providers/ShoppingCartProvider.tsx';
import { groupBy } from 'es-toolkit';

const ShoppingCart = () => {
  const { cartItems } = useShoppingCart();

  const groupedItems = groupBy(cartItems, (item) => item.id);

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-6">장바구니</h1>
        {Object.entries(groupedItems).map(([id, items]) => {
          const product = items[0];
          return <ShoppingCartItem key={`ShoppingCartItem-${id}`} product={product} totalQuantity={items.length} />;
        })}
        <ShoppingCartItemSelectField />
        <ShoppingCartTotalPrice />
        <ShoppingCartStockInfo />
      </div>
    </div>
  );
};

export default ShoppingCart;
