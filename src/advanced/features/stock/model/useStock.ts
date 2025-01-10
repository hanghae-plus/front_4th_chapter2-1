import { useEffect, useState } from "react";
import { getProducts, Product } from "@advanced/entities/product";

export const useStock = () => {
  const [stock, setStock] = useState<Product[]>([]);

  useEffect(() => {
    const fetchStock = async () => {
      const stock = await getProducts();
      setStock(stock);
    };

    fetchStock();
  }, []);

  const handleUpdateStockQuantity = (productId: string, delta: number) => {
    const foundedItem = stock.find((item) => item.id === productId);

    if (!foundedItem) {
      throw Error();
    }

    if (foundedItem.quantity + delta < 0) {
      alert("재고가 부족합니다.");
      throw Error();
    }

    setStock((prev) =>
      prev.map((item) =>
        item.id === productId
          ? { ...item, quantity: item.quantity + delta }
          : item
      )
    );
  };

  return { stock, handleUpdateStockQuantity };
};
