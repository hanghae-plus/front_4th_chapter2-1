import { useEffect, useState } from "react";
import { Product } from "../types";

export const useCart = () => {
  const [shoppingCart, setShoppingCart] = useState<Product[]>([]);
  const [cartTotalPrice, setCartTotalPrice] = useState<number>(0);
  const [cartCount, setCartCount] = useState<number>(0);
  const [originTotalPrice, setOriginTotalPrice] = useState<number>(0);
  const [discountRate, setDiscountRate] = useState<number>(0);

  useEffect(() => {
    console.log(shoppingCart);
  }, [shoppingCart]);

  const getCartProductById = (id: string) => {
    return shoppingCart.find((prod) => prod.id === id);
  };

  const addToCart = (product: Product) => {
    setShoppingCart((prev) => [...prev, { ...product, quantity: 1 }]);
  };

  const removeCart = (id: string) => {
    setShoppingCart((prev) => [...prev.filter((prod) => prod.id !== id)]);
  };

  const increaseCart = (id: string) => {
    setShoppingCart((prev) =>
      prev.map((prod) => {
        if (prod.id === id) {
          prod.quantity += 1;
        }
        return prod;
      })
    );
  };

  const decreaseCart = (id: string) => {
    setShoppingCart((prev) =>
      prev.map((prod) => {
        if (prod.id === id) {
          prod.quantity -= 1;
        }
        return prod;
      })
    );
  };

  const calcTotalPrice = () => {
    let totalPrice = 0;
    shoppingCart.forEach((product) => {
      let discount = 1;
      if (product.quantity >= 10) {
        discount = 1 - product.discount;
      }
      totalPrice += product.price * product.quantity * discount;
    });
    if (new Date().getDay() === 2) {
      totalPrice *= 1 - 0.1;
    }
    return totalPrice;
  };

  const calculateCartCount = () => {
    return shoppingCart.reduce((acc, cur) => (acc += cur.quantity), 0);
  };

  const calcOriginTotalPrice = () => {
    return shoppingCart.reduce((acc, cur) => (acc += cur.price * cur.quantity), 0);
  };

  const calcDiscountRate = () => {
    const bulkDiscPrice = originTotalPrice * 0.25;
    const normalDiscPrice = originTotalPrice - cartTotalPrice;
    const originDiscountRate = (originTotalPrice - cartTotalPrice) / originTotalPrice;

    let rate = cartCount >= 30 && bulkDiscPrice > normalDiscPrice ? 0.25 : originDiscountRate;
    if (new Date().getDay() === 2) {
      return Math.max(rate, 0.1);
    }
    return rate;
  };

  useEffect(() => {
    setCartTotalPrice(calcTotalPrice());
    setCartCount(calculateCartCount());
    setOriginTotalPrice(calcOriginTotalPrice());
    setDiscountRate(calcDiscountRate());
  }, [shoppingCart]);

  return { shoppingCart, cartTotalPrice, cartCount, discountRate, getCartProductById, addToCart, removeCart, increaseCart, decreaseCart };
};
