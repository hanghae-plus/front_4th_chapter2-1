import useProductList from './useProductList.tsx';
import { ChangeEvent, useState } from 'react';

const useSelectProduct = () => {
  const {
    productList,
    handleRandomPromotion,
    handleClickIncreaseProductQuantity,
    handleClickDecreaseProductQuantity,
  } = useProductList();
  const [selectedProductId, setSelectedProductId] = useState(productList[0].id);

  const handleChangeSelectedProduct = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedProductId(e.target.value);
  }

  return {
    productList,
    selectedProductId,
    handleRandomPromotion,
    handleChangeSelectedProduct,
    handleClickIncreaseProductQuantity,
    handleClickDecreaseProductQuantity,
  }
};

export default useSelectProduct;
