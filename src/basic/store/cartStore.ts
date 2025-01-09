import { ProductStore } from './productStore';
import { calculateCartPrice } from '../utils/cart/calculateCart';
import { createStore } from '../utils/createStore';

export interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartState {
  cartList: Product[];
  totalPrice: number;
  totalDiscountRate: number;
  point: number;
}

interface CartActions {
  getCartList: () => Product[];
  addCartItem: (item: Product) => void;
  removeCartItem: (id: string) => void;
  getTotalPrice: () => number;
  getTotalDiscountRate: () => number;
  getPoint: () => number;
  clearCartItem: (id: string) => void;
}

export const CartStore = createStore<CartState, CartActions>(
  {
    cartList: [],
    totalPrice: 0,
    totalDiscountRate: 0,
    point: 0,
  },
  (state, notify) => {
    const { actions } = ProductStore;

    const updateCartList = (cartList: Product[]) => {
      state.cartList = cartList;

      const { finalPrice, finalDiscountRate, point } = calculateCartPrice(cartList);

      state.totalPrice = finalPrice;
      state.totalDiscountRate = finalDiscountRate;
      state.point = point;
    };

    const getMatchedCartItemById = (id: string) => {
      return state.cartList.find((cartItem) => cartItem.id === id);
    };

    const getUpdatedCartListWithQuantity = (item: Product, delta: number) => {
      return state.cartList.map((cartItem) =>
        cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + delta } : cartItem,
      );
    };

    const clearCartItemById = (id: string) => {
      const filteredCartList = state.cartList.filter((cartItem) => cartItem.id !== id);
      updateCartList(filteredCartList);
    };

    return {
      getCartList: () => {
        return state.cartList;
      },
      getTotalPrice: () => {
        return state.totalPrice;
      },
      getTotalDiscountRate: () => {
        return state.totalDiscountRate;
      },
      getPoint: () => {
        return state.point;
      },
      clearCartItem: (id: string) => {
        clearCartItemById(id);
        actions.resetQuantity(id);

        notify();
      },
      addCartItem: (item: Product) => {
        actions.addLastSaleItem(item);

        const matchedCartItem = getMatchedCartItemById(item.id);

        if (matchedCartItem) {
          const updatedCartList = getUpdatedCartListWithQuantity(matchedCartItem, 1);

          updateCartList(updatedCartList);
          return;
        }

        const updatedCartList = [...state.cartList, { ...item, quantity: 1 }];

        updateCartList(updatedCartList);

        notify();
      },
      removeCartItem: (id: string) => {
        const matchedCartItem = getMatchedCartItemById(id);

        if (!matchedCartItem) return;

        if (matchedCartItem.quantity === 1) {
          clearCartItemById(id);
          return;
        }

        const updatedCartList = getUpdatedCartListWithQuantity(matchedCartItem, -1);

        updateCartList(updatedCartList);

        notify();
      },
    };
  },
);
