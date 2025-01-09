import { Product } from "../../types/cart";

interface StockInfoProps {
  products: Product[];
}

export function StockInfo({ products }: StockInfoProps) {
  const lowStockProducts = products.filter((item) => item.q < 5);

  return (
    <div className="text-sm text-gray-500 mt-2">
      {lowStockProducts.map((item) => (
        <div key={item.id}>
          {item.name}: {item.q > 0 ? `재고 부족 (${item.q}개 남음)` : "품절"}
        </div>
      ))}
    </div>
  );
}
