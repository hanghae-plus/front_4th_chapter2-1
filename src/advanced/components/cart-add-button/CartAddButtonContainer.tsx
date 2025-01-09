import { MouseEvent } from 'react';
import { NO_STOCK } from '../../constants';
import { useProduct } from '../../context/ProductContext';
import CartAddButton from './CartAddButton';

export default function CartAddButtonContainer() {
  const { lastSelectedItem, updateProductQuantity, productList } = useProduct();

  const handleClick = (e: MouseEvent) => {
    e.preventDefault();
    const target = e.target as HTMLButtonElement;
    const productId = target?.dataset?.id;
    if (!productId) {
      return;
    }

    const stockQuantity = productList.find((product) => product.id === productId)?.quantity || 0;
    if (stockQuantity === 0) {
      alert(NO_STOCK);
      return;
    }
    updateProductQuantity(productId, -1);
  };

  return <CartAddButton handleClick={handleClick} productId={lastSelectedItem} />;
}
