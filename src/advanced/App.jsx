import React, { useState, useEffect } from "react";

const App = () => {
  const initialProducts = [
    { id: "p1", name: "상품1", val: 10000, q: 50 },
    { id: "p2", name: "상품2", val: 20000, q: 30 },
    { id: "p3", name: "상품3", val: 30000, q: 20 },
    { id: "p4", name: "상품4", val: 15000, q: 0 },
    { id: "p5", name: "상품5", val: 25000, q: 10 },
  ];

  const [products, setProducts] = useState(initialProducts);
  const [cart, setCart] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [bonusPoints, setBonusPoints] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [lastSelectedProduct, setLastSelectedProduct] = useState(null);

  // 상품 선택 이벤트 핸들러
  const handleProductSelect = (event) => {
    setSelectedProductId(event.target.value);
  };

  // 장바구니에 추가
  const handleAddToCart = () => {
    if (!selectedProductId) return;

    const selectedProduct = products.find((item) => item.id === selectedProductId);

    if (selectedProduct.q === 0) {
      alert("재고가 부족합니다.");
      return;
    }

    setLastSelectedProduct(selectedProduct.id);

    const existingCartItem = cart.find((item) => item.id === selectedProduct.id);

    if (existingCartItem) {
      const updatedCart = cart.map((item) =>
        item.id === selectedProduct.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      setCart(updatedCart);
    } else {
      setCart([...cart, { ...selectedProduct, quantity: 1 }]);
    }

    const updatedProducts = products.map((item) =>
      item.id === selectedProduct.id ? { ...item, q: item.q - 1 } : item
    );
    setProducts(updatedProducts);
  };

  // 장바구니에서 삭제
  const handleRemoveFromCart = (productId) => {
    const cartItem = cart.find((item) => item.id === productId);

    if (!cartItem) return;

    const updatedCart = cart.filter((item) => item.id !== productId);

    setCart(updatedCart);

    const updatedProducts = products.map((item) =>
      item.id === productId ? { ...item, q: item.q + cartItem.quantity } : item
    );
    setProducts(updatedProducts);

    alert("장바구니에서 상품이 삭제되었습니다.");
  };

  // 장바구니 계산
  useEffect(() => {
    let total = 0;
    let points = 0;

    cart.forEach((item) => {
      let discount = 0;

      if (item.quantity >= 10) {
        if (item.id === "p1") discount = 0.1;
        if (item.id === "p2") discount = 0.15;
        if (item.id === "p3") discount = 0.2;
        if (item.id === "p4") discount = 0.05;
        if (item.id === "p5") discount = 0.25;
      }

      const subtotal = item.val * item.quantity * (1 - discount);
      total += subtotal;
    });

    // 화요일 추가 할인
    const today = new Date();
    if (today.getDay() === 2) {
      total *= 0.9;
    }

    points = Math.floor(total / 1000);

    setTotalAmount(Math.round(total));
    setBonusPoints(points);
  }, [cart]);

  // 번개세일 (20% 할인)
  useEffect(() => {
    const salesInterval = setInterval(() => {
      const eligibleProducts = products.filter((item) => item.q > 0);
      const randomProduct =
        eligibleProducts[Math.floor(Math.random() * eligibleProducts.length)];

      if (randomProduct) {
        const updatedProducts = products.map((item) =>
          item.id === randomProduct.id ? { ...item, val: Math.round(item.val * 0.8) } : item
        );
        setProducts(updatedProducts);
        alert(`번개세일! ${randomProduct.name}이(가) 20% 할인 중입니다!`);
      }
    }, 30000);

    return () => clearInterval(salesInterval);
  }, [products]);

  // 추천 상품 (5% 추가 할인)
  useEffect(() => {
    const recommendInterval = setInterval(() => {
      if (lastSelectedProduct) {
        const recommendedProduct = products.find(
          (item) => item.id !== lastSelectedProduct && item.q > 0
        );

        if (recommendedProduct) {
          const updatedProducts = products.map((item) =>
            item.id === recommendedProduct.id
              ? { ...item, val: Math.round(item.val * 0.95) }
              : item
          );
          setProducts(updatedProducts);

          alert(
            `${recommendedProduct.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`
          );
        }
      }
    }, 60000);

    return () => clearInterval(recommendInterval);
  }, [lastSelectedProduct, products]);

  return (
    <div className="bg-gray-100 p-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
        <h1 className="text-2xl font-bold mb-4">장바구니</h1>

        {/* 상품 선택 및 추가 */}
        <select
          value={selectedProductId}
          onChange={handleProductSelect}
          className="border rounded p-2 mr-2"
        >
          <option value="" disabled>
            상품 선택
          </option>
          {products.map((product) => (
            <option
              key={product.id}
              value={product.id}
              disabled={product.q === 0}
            >
              {product.name} - {product.val.toLocaleString()}원 (
              {product.q > 0 ? `재고: ${product.q}` : "품절"})
            </option>
          ))}
        </select>
        <button
          onClick={handleAddToCart}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          추가
        </button>

        {/* 장바구니 */}
        <div id="cart-items" className="mt-4">
          {cart.map((item) => (
            <div key={item.id} className="flex justify-between items-center mb-2">
              <span>
                {item.name} - {item.val.toLocaleString()}원 x {item.quantity}
              </span>
              <button
                onClick={() => handleRemoveFromCart(item.id)}
                className="text-red-500"
              >
                삭제
              </button>
            </div>
          ))}
        </div>

        {/* 총액 및 포인트 */}
        <div id="cart-total" className="text-xl font-bold my-4">
          총액: {totalAmount.toLocaleString()}원 (포인트: {bonusPoints})
        </div>

        {/* 재고 상태 */}
        <div id="stock-status" className="text-sm text-gray-500 mt-2">
          상품 상태: {products.some((product) => product.q > 0) ? "충분" : "품절"}
        </div>
      </div>
    </div>
  );
};

export default App;
