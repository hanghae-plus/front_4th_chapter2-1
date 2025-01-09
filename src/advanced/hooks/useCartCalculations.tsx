import useCartList from './useCartList.tsx';
import useSelectProduct from './useSelectProduct.tsx';
import { useEffect } from 'react';
import { calculateFinalValues } from '../utils/cartListUtils.ts';

const useCartCalculations = () => {
  const {
    productList,
    selectedProductId,
    handleRandomPromotion,
    handleChangeSelectedProduct,
    handleClickIncreaseProductQuantity,
    handleClickDecreaseProductQuantity,
  } = useSelectProduct();

  const {
    cartList,
    handleClickAddProductToCart,
    handleClickRemoveProductFromCart,
    handleClickIncreaseQuantityFromCart,
    handleClickDecreaseQuantityFromCart,
    handleRandomPromotionFromCart,
  } = useCartList();

  const handleClickAddToCart = (productId: string) => {
    const selectedProduct = productList.find((product) => product.id === productId);
    if (!selectedProduct) return;
    if (selectedProduct.quantity === 0) {
      alert('재고가 부족합니다.');
      return;
    }
    handleClickAddProductToCart(selectedProduct);
    handleClickDecreaseProductQuantity(productId);
  };

  const handleClickRemoveFromCart = (productId: string) => {
    const selectedProduct = cartList.find((product) => product.id === productId);
    if (!selectedProduct) return;
    handleClickRemoveProductFromCart(productId);
    handleClickIncreaseProductQuantity(productId, selectedProduct.quantity);
  };

  const handleClickIncreaseQuantity = (productId: string) => {
    const selectedProduct = productList.find((product) => product.id === productId);
    if (!selectedProduct) return;
    if (selectedProduct.quantity === 0) {
      alert('재고가 부족합니다.');
      return;
    }
    handleClickDecreaseProductQuantity(productId);
    handleClickIncreaseQuantityFromCart(productId);
  };

  const handleClickDecreaseQuantity = (productId: string) => {
    const selectedProduct = cartList.find((product) => product.id === productId);
    if (selectedProduct?.quantity === 1) {
      handleClickRemoveProductFromCart(productId);
    } else {
      handleClickDecreaseQuantityFromCart(productId);
    }
    handleClickIncreaseProductQuantity(productId);
  };

  const {discountRate, price} = calculateFinalValues(cartList);


  useEffect(() => {
    setTimeout(() => {
      setInterval(() => {
        let luckyProduct = productList[Math.floor(Math.random() * productList.length)];
        if (Math.random() < 0.3 && luckyProduct.quantity > 0) {
          alert(`번개세일! ${luckyProduct.name}이(가) 20% 할인 중입니다!`);
          handleRandomPromotion(luckyProduct.id, 0.2);
          handleRandomPromotionFromCart(luckyProduct.id, 0.2);
        }
      }, 30000);
    }, Math.random() * 10000);

    setTimeout(() => {
      setInterval(() => {
        const suggestedProduct = productList.find((product) => product.id !== selectedProductId && product.quantity > 0);
        if (suggestedProduct) {
          alert(`${suggestedProduct.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);
          handleRandomPromotion(suggestedProduct.id, 0.05);
          handleRandomPromotionFromCart(suggestedProduct.id, 0.05);
        }
      }, 60000);
    }, Math.random() * 20000);
  }, []);



  return {
    price,
    cartList,
    productList,
    discountRate,
    selectedProductId,
    handleClickAddToCart,
    handleClickRemoveFromCart,
    handleClickIncreaseQuantity,
    handleClickDecreaseQuantity,
    handleChangeSelectedProduct,
  };

};

export default useCartCalculations;
