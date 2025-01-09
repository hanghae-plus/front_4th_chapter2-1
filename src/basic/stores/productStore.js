import { createStore } from '../lib/createStore.js';
import { PRODUCT_LIST_MOCK } from '../mock/productMock.js';

export const productStore = createStore(
  {
    totalPrice: 0,
    productList: PRODUCT_LIST_MOCK,
    cartList: [],
    lastSelectedProductId: null,
  },
  {
    setSelectedProduct(state, productId) {
      return { ...state, lastSelectedProductId: productId };
    },
    addToCart(state, productId) {
      const productIndex = state.productList.findIndex((p) => p.id === productId);

      if (productIndex === -1) return state;

      const product = state.productList[productIndex];

      if (product.quantity <= 0) {
        alert('재고가 부족합니다.');
        return state;
      }

      const updatedProductList = [...state.productList];
      updatedProductList[productIndex] = {
        ...product,
        quantity: product.quantity - 1,
      };

      const cartItemIndex = state.cartList.findIndex((c) => c.id === productId);
      const updatedCartList = [...state.cartList];
      if (cartItemIndex > -1) {
        updatedCartList[cartItemIndex] = {
          ...updatedCartList[cartItemIndex],
          quantity: updatedCartList[cartItemIndex].quantity + 1,
        };
      } else {
        updatedCartList.push({ ...product, quantity: 1 });
      }

      return { ...state, productList: updatedProductList, cartList: updatedCartList };
    },
    updateQuantity(state, productId, quantityChange) {
      const product = state.productList.find((p) => p.id === productId);
      const cartItem = state.cartList.find((c) => c.id === productId);

      if (!product || !cartItem) return state;

      const updatedProductList = state.productList.map((p) =>
        p.id === productId ? { ...p, quantity: p.quantity - quantityChange } : p
      );

      const updatedCartList = state.cartList
        .map((c) => (c.id === productId ? { ...c, quantity: c.quantity + quantityChange } : c))
        .filter((c) => c.quantity > 0);

      return { ...state, productList: updatedProductList, cartList: updatedCartList };
    },
    removeToCart(state, productId) {
      const cartItem = state.cartList.find((c) => c.id === productId);
      if (!cartItem) return state;

      const updatedProductList = state.productList.map((p) =>
        p.id === productId ? { ...p, quantity: p.quantity + cartItem.quantity } : p
      );

      const updatedCartList = state.cartList.filter((c) => c.id !== productId);

      return { ...state, productList: updatedProductList, cartList: updatedCartList };
    },
  }
);
