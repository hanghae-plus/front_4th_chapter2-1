import type { StockStatus } from '../types/stockStatus.type';

export const Stock = ({ stockStatus }: { stockStatus: StockStatus[] }) => {
  return (
    <div id="stock-status" className="text-sm text-gray-500 mt-2">
      {stockStatus.map((item) => `${item.name}: ${item.status}`).join('\n')}
    </div>
  );
};
