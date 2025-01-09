import { useGetProductList } from '../../contexts/product-context/ProductContext';

const LOW_STOCK = 5;
const OUT_OF_STOCK = 0;

export const StockInfo = () => {
  const productList = useGetProductList();

  const getStockMessage = (name: string, quantity: number) => {
    if (quantity === OUT_OF_STOCK) return `${name}: 품절 `;
    if (quantity < LOW_STOCK) return `${name}: 재고 부족 (${quantity}개 남음) `;
    return null;
  };

  return (
    <div className="text-sm text-gray-500 mt-2">
      {productList.map(({ name, quantity, id }) => {
        const stockMessage = getStockMessage(name, quantity);

        return stockMessage && <span key={id}>{stockMessage} </span>;
      })}
    </div>
  );
};
