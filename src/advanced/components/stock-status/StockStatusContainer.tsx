import { useProduct } from '../../context/ProductContext';
import StockStatus from './StockStatus';
import { updateStockInfoMessage } from './updateInfoMessage';

export default function StockStatusContainer() {
  const { productList } = useProduct();
  const message = updateStockInfoMessage(productList);

  return <StockStatus message={message} />;
}
