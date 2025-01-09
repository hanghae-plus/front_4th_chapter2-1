import { productStore } from "../../store";

export const updateProductStock = (products, productId, quantity) => {
  if (!products || !productId) return;

  productStore.set(
    "products",
    products.map((product) =>
      product?.id === productId
        ? { ...product, stock: product.stock + quantity }
        : product,
    ),
  );
};
