import { useCartContext } from '../../context/CartContext';
import { getLowStockItems } from '../../utils/getLowStockItems';

function StockInfo() {
  const { productList } = useCartContext();
  const lowStockItems = getLowStockItems(productList);

  return (
    <div id="stock-status" className="text-sm text-gray-500 mt-2">
      {lowStockItems.map((item) => (item.volume > 0 ? `${item.name}: 재고 부족 (${item.volume}개 남음)` : `${item.name}: 품절`)).join('\n')}
    </div>
  );
}

export default StockInfo;
