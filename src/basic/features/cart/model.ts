import { Product, productStore } from "@basic/entities/product";
import { createStore } from "@basic/shared/lib";

export type Cart = Product[];

interface CartStore {
  cart: Cart;
  addToCart: (product: Product) => void;
  removeToCart: (productId: string) => void;
  deleteToCart: (productId: string) => void;
}
export const cartStore = createStore<CartStore>((set, get) => ({
  cart: [],
  addToCart: (product: Product) => {
    const { cart } = get();
    const { updateProductQuantity } = productStore.getState();
    const foundProduct = cart.find((cartItem) => cartItem.id === product.id);
    if (product.q === 0) {
      return alert("재고가 부족합니다.");
    }

    if (foundProduct) {
      set((prev) => ({
        ...prev,
        cart: prev.cart.map((cartItem) =>
          cartItem.id === product.id
            ? { ...cartItem, q: cartItem.q + 1 }
            : cartItem
        )
      }));
    } else {
      set((prev) => ({
        ...prev,
        cart: [...prev.cart, { ...product, q: 1 }]
      }));
    }
    updateProductQuantity(product.id, -1);
  },
  removeToCart: (productId: string) => {
    const { cart } = get();
    const { updateProductQuantity } = productStore.getState();

    const foundProduct = cart.find((cartItem) => cartItem.id === productId);

    if (!foundProduct) return;

    if (foundProduct.q <= 1) {
      set((prev) => ({
        ...prev,
        cart: prev.cart.filter((cartItem) => cartItem.id !== productId)
      }));
    } else {
      set((prev) => ({
        ...prev,
        cart: prev.cart.map((cartItem) =>
          cartItem.id === productId
            ? { ...cartItem, q: cartItem.q - 1 }
            : cartItem
        )
      }));
    }
    updateProductQuantity(productId, 1);
  },
  deleteToCart: (productId: string) => {
    const { cart } = get();

    const { updateProductQuantity } = productStore.getState();
    const foundProduct = cart.find((cartItem) => cartItem.id === productId);

    set((prev) => ({
      ...prev,
      cart: prev.cart.filter((cartItem) => cartItem.id !== productId)
    }));
    updateProductQuantity(productId, foundProduct?.q || 0);
  }
}));
