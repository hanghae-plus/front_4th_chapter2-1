import { useState } from "react";
import { Product } from "../config/constans";

// CartItem: 장바구니 항목을 객체 형태로 관리하며, 키는 상품 ID
interface CartItem {
  [key: string]: {
    id: string;
    price: number;
    quantity: number;
  };
}

// 상품 데이터(products)와 상태(setProducts)를 받아 장바구니 관련 동작 관리
const useCartActions = (
  products: Product[],
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>
) => {
  // cartItems 상태: 장바구니 내 상품 데이터 관리
  const [cartItems, setCartItems] = useState<CartItem>({});

  // lastPickProduct 상태: 마지막으로 장바구니에 추가된 상품 ID 저장
  const [lastPickProduct, setLastPickProduct] = useState<string | null>(null);

  // 상품을 장바구니에 추가하는 함수
  const addToCart = (productId: string) => {
    const product = products.find((p) => p.id === productId);

    // 상품이 없거나 재고가 부족할 경우 추가를 종료
    if (!product || product.quantity <= 0) return;

    // 장바구니 상태 업데이트.
    setCartItems((prev) => {
      const currentQuantity = prev[productId]?.quantity || 0; // 기존 수량 가져오기
      return {
        ...prev,
        [productId]: {
          ...product, // 상품 정보 복사
          quantity: currentQuantity + 1
        }
      };
    });

    // 상품 목록 상태 업데이트: 재고 1 감소
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
        ? { ...p, quantity: p.quantity - 1}
        : p
      )
    );

    // 마지막으로 추가된 상품 ID 저장
    setLastPickProduct(productId);
  };

  // 장바구니 내 상품 수량을 업데이트하는 함수
  const updateCartQuantity = (productId: string, change: number) => {
    const product = products.find((p) => p.id === productId);

    // 현재 장바구니에 담긴 수량 가져오기
    const currentQuantity = cartItems[productId]?.quantity || 0;
    const newQuantity = currentQuantity + change; // 새 수량 계산

    if (newQuantity <= 0) {
      // 상품 수량이 0 이하인 경우: 장바구니에서 제거
      const { [productId]: removed, ...rest } = cartItems;
      setCartItems(rest);

      // 상품 목록 상태 복원: 장바구니 수량만큼 재고를 다시 추가
      setProducts((prev) =>
        prev.map((p) =>
          p.id === productId
          ? { ...p, quantity: p.quantity + currentQuantity }
          : p
        )
      );
    } else if (change > 0 && product?.quantity <= 0) {
      // 수량 증가 시, 재고가 없을 경우 경고
      alert("재고가 부족합니다");
    } else {
      // 수량 변경: 장바구니 상태 업데이트
      setCartItems((prev) => ({
        ...prev,
        [productId]: {
          ...prev[productId],
          quantity: newQuantity, // 새 수량으로 업데이트
        }
      }));

      // 상품 목록 상태 업데이트: 변경된 수량만큼 재고 조정
      setProducts((prev) =>
        prev.map((p) =>
          p.id === productId
          ? { ...p, quantity: p.quantity - change }
          : p
        )
      );
    }
  };

  return { cartItems, lastPickProduct, addToCart, updateCartQuantity };
};

export default useCartActions;