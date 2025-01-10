import { Product } from "@advanced/entities/product";

interface StockStatusProps {
  filteredStock: Product[];
}

export function StockStatus({ filteredStock }: StockStatusProps) {
  return (
    <div className="text-sm text-gray-500 mt-2">
      {filteredStock.map(
        (item) =>
          `${item.name}: ${item.quantity > 0 ? "재고 부족 (" + item.quantity + "개 남음) " : "품절 "}`
      )}
    </div>
  );
}
