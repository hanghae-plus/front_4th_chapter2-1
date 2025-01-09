import { useEffect } from 'react';
import { handleRecommendedSaleAlert, handleWowSaleAlert } from '../../utils/event';
import { Product } from '../../types/product';

interface ProductSelectType {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  lastSelectedProduct: string;
}

function ProductSelect({ products, setProducts, lastSelectedProduct }: ProductSelectType) {
  useEffect(() => {
    setTimeout(() => {
      setInterval(() => handleRecommendedSaleAlert(lastSelectedProduct, setProducts), 60000);
    }, Math.random() * 20000);

    setTimeout(() => {
      setInterval(() => handleWowSaleAlert(setProducts), 30000);
    }, Math.random() * 10000);
  }, []);

  return (
    <>
      {products.map((product) => (
        <option key={product.id} value={product.id} disabled={product.stockQuantity === 0}>
          {product.name} - {product.price}원
        </option>
      ))}
    </>
  );
}

export default ProductSelect;
