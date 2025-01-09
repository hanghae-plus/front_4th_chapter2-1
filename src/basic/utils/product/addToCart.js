import { cartStore, productStore } from "../../store";

export const addToCart = () => {
  const selectedProductId = document.getElementById("product-select").value;
  const products = productStore.get("products");
  const selectedProduct = products.find(
    (product) => product.id === selectedProductId,
  );

  if (!selectedProduct || selectedProduct.stock <= 0) return;

  const $cartItems = document.getElementById("cart-items");
  const $existingItem = document.getElementById(selectedProduct.id);

  if ($existingItem) {
    const currentQuantity = parseInt(
      $existingItem.querySelector("span").textContent.split("x ")[1],
    );
    const newQuantity = currentQuantity + 1;

    if (newQuantity <= selectedProduct.stock) {
      $existingItem.querySelector("span").textContent =
        `${selectedProduct.name} - ${selectedProduct.price}원 x ${newQuantity}`;

      updateProductStock(products, selectedProduct.id);
    } else {
      alert("재고가 부족합니다.");
      return;
    }
  } else {
    const $newItem = document.createElement("div");
    $newItem.id = selectedProduct.id;
    $newItem.className = "flex justify-between items-center mb-2";
    $newItem.innerHTML = `
      <span>${selectedProduct.name} - ${selectedProduct.price}원 x 1</span>
      <div>
        <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" 
          data-product-id="${selectedProduct.id}" 
          data-change="-1">-</button>
        <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" 
          data-product-id="${selectedProduct.id}" 
          data-change="1">+</button>
        <button class="remove-item bg-red-500 text-white px-2 py-1 rounded" 
          data-product-id="${selectedProduct.id}">삭제</button>
      </div>
    `;

    $cartItems.appendChild($newItem);
    updateProductStock(products, selectedProduct.id);
  }

  // cartState 업데이트만 하면 구독을 통해 calculateCart가 실행됨
  cartStore.set("cartState", {
    ...cartStore.get("cartState"),
    lastSelected: selectedProductId,
  });
};

const updateProductStock = (products, productId) => {
  productStore.set(
    "products",
    products.map((product) =>
      product.id === productId
        ? { ...product, stock: product.stock - 1 }
        : product,
    ),
  );
};
