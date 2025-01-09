import React from "react";
import { useCart } from "../../../../contexts/CartContext";
import { useProduct } from "../../../../contexts/ProductContext";
import { combineStyles } from "../../../../utils";

const ProductAddButton = () => {
  const { productState } = useProduct();
  const { cartState, setCartState } = useCart();

  const productAddButtonStyles = combineStyles(
    "bg-blue-500",
    "text-white",
    "px-4",
    "py-2",
    "rounded"
  );

  const handleAddToCart = () => {
    const selectedId = productState.selectedProductId;
    if (!selectedId) return;

    const selectedProduct = productState.products.find(
      (product) => product.id === selectedId
    );
    if (!selectedProduct) return;

    if (selectedProduct.stock === 0) {
      alert("재고가 부족합니다");
      return;
    }

    const existingItem = cartState.items.find((item) => item.id === selectedId);
    if (existingItem) {
      if (existingItem.quantity >= selectedProduct.stock) {
        alert("재고가 부족합니다");
        return;
      }

      setCartState((prev) => ({
        ...prev,
        items: prev.items.map((item) =>
          item.id === selectedId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
        lastSelected: selectedId,
      }));
    } else {
      setCartState((prev) => ({
        ...prev,
        items: [...prev.items, { id: selectedId, quantity: 1 }],
        lastSelected: selectedId,
      }));
    }
  };

  return (
    <button
      id="add-to-cart"
      className={productAddButtonStyles}
      onClick={handleAddToCart}
      disabled={!productState.selectedProductId}
    >
      추가
    </button>
  );
};

export default ProductAddButton;
