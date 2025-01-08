import React, { useState, useEffect } from "react";
import CartDisplay from "./components/CartDisplay";
import ProductSelector from "./components/ProductSelector";
import StockInfo from "./components/StockInfo";
import { CONSTANTS, initialProductList } from "./config/constans";

const App = () => {
  const [products, setProducts] = useState(initialProductList);
  const [cartItems, setCartItems] = useState({});
  const [lastPickProduct, setLastPickProduct] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [bonusPoints, setBonusPoints] = useState(0);

  const addToCart = (productId) => {
    const product = products.find(p => p.id === productId);
    if (!product || product.quantity <= 0) return;

    setCartItems(prev => {
      const currentQuantity = prev[productId]?.quantity || 0;
      return {
        ...prev,
        [productId]: {
          ...product,
          quantity: currentQuantity + 1
        }
      };
    });

    setProducts(prev =>
      prev.map(p =>
        p.id === productId
        ? { ...p, quantity: p.quantity - 1}
        : p
      )
    );

    setLastPickProduct(productId);
  };

  const updateCartQuantity = (productId, change) => {
    const product = products.find(p => p.id === productId);
    const currentQuantity = cartItems[productId]?.quantity || 0
    const newQuantity = currentQuantity + change;

    if (newQuantity <= 0) {
      const { [productId]: removed, ...rest } = cartItems;
      setCartItems(rest);
      setProducts(prev =>
        prev.map(p =>
          p.id === productId
          ? { ...p, quantity: p.quantity + currentQuantity }
          : p
        )
      );
    } else if (change > 0 && product.quantity <= 0) {
      alert("재고가 부족합니다");
    } else {
      setCartItems(prev => ({
        ...prev,
        [productId]: {
          ...prev[productId],
          quantity: newQuantity
        }
      }));
      setProducts(prev =>
        prev.map(p =>
          p.id === productId
          ? { ...p, quantity: p.quantity - change }
          : p
        )
      );
    }
  };

  const getQuantityDiscount = (productId) => {
    const discountRates = {
      p1: 0.1,
      p2: 0.15,
      p3: 0.2,
      p4: 0.05,
      p5: 0.25,
    };
    return discountRates[productId] || 0;
  };

  useEffect(() => {
    const calculateTotal = () => {
      let subTotal = 0;
      let totalItems = 0;
      let quantityDiscount = false;

      Object.entries(cartItems).forEach(([id, item]) => {
        const itemTotal = item.price * item.quantity;
        let discountRate = 0;

        if (item.quantity >= 10) {
          discountRate = getQuantityDiscount(id);
          quantityDiscount = true;
        }

        totalItems += item.quantity;
        subTotal += itemTotal * (1 - discountRate);
      });

      if (totalItems >= 30) {
        subTotal *= (1 - CONSTANTS.BULK_DISCOUNT_RATE);
      }

      const currentDay = new Date().getDay();
      if (currentDay === CONSTANTS.DISCOUNT_DAY) {
        subTotal *= (1 - CONSTANTS.DAY_DISCOUNT_RATE);
      }

      setTotalAmount(Math.round(subTotal));
      setBonusPoints(Math.floor(subTotal / CONSTANTS.BONUS_POINT_DIVISOR));
    };

    calculateTotal();
  }, [cartItems]);

  useEffect(() => {
    const flashSaleTimer = setInterval(() => {
      setProducts(prev => {
        const luckyItemIndex = Math.floor(Math.random() * prev.length);
        if (Math.random() < CONSTANTS.SALE_CHANCE && prev[luckyItemIndex].quantity > 0) {
          const newProducts = [...prev];
          const luckyItem = newProducts[luckyItemIndex];
          luckyItem.price = Math.round(luckyItem.price * (1 - CONSTANTS.SALE_DISCOUNT));
          alert(`번개세일! ${luckyItem.name}이(가) 20% 할인 중입니다!`);
          return newProducts;
        }
        return prev;
      });
    }, 30000);

    const recommendTimer = setInterval(() => {
      if (lastPickProduct) {
        setProducts(prev => {
          const recommendedItem = prev.find(
            item => item.id !== lastPickProduct && item.quantity > 0
          );
          if (recommendedItem) {
            const newProducts = [...prev];
            const itemIndex = newProducts.findIndex(item => item.id === recommendedItem.id);
            newProducts[itemIndex].price = Math.floor(
              newProducts[itemIndex].price * (1 - CONSTANTS.SUGGEST_DISCOUNT)
            );
            alert(`${recommendedItem.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);
            return newProducts;
          }
          return prev;
        });
      }
    }, 60000);

    return () => {
      clearInterval(flashSaleTimer);
      clearInterval(recommendTimer);
    };
  }, [lastPickProduct]);

  return (
    <div className="bg-gray-100 p-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
        <h1 className="text-2xl font-bold mb-4">장바구니</h1>
        <CartDisplay
          cartItems={cartItems}
          updateQuantity={updateCartQuantity}
        />
        <div className="text-xl font-bold my-4">
          총액: {totalAmount.toLocaleString()}원
          <span className="text-blue-500 ml-2">(포인트: {bonusPoints.toLocaleString()})</span>
        </div>
        <ProductSelector
          products={products}
          onAdd={addToCart}
        />
        <StockInfo products={products} />
      </div>
    </div>
  );
}

export default App;