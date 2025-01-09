import { createStore } from '../utils/createStore';
import { calculateCartPrice } from './utils/cart/calculateCartPrice';

export interface Product {
  id: string;
  name: string;
  amount: number;
  quantity: number;
}

interface CartState {
  cartList: Product[];
  totalAmount: number;
  totalDiscountRate: number;
  point: number;
}

interface CartActions {
  getCartList: () => Product[];
  getCartItem: (id: string) => Product | undefined;
  addCartItem: (item: Product) => void;
  removeCartItem: (id: string) => void;
  getTotalAmount: () => number;
  getTotalDiscountRate: () => number;
  getPoint: () => number;
}

export const CartStore = createStore<CartState, CartActions>(
  {
    cartList: [],
    totalAmount: 0,
    totalDiscountRate: 0,
    point: 0,
  },
  (state, notify) => {
    const updateCartList = (cartList: Product[]) => {
      state.cartList = cartList;

      const { finalAmount, finalDiscountRate, point } = calculateCartPrice(cartList);

      state.totalAmount = finalAmount;
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
      getCartItem: (id: string) => {
        return state.cartList?.find((item) => item.id === id);
      },
      getTotalAmount: () => {
        return state.totalAmount;
      },
      getTotalDiscountRate: () => {
        return state.totalDiscountRate;
      },
      getPoint: () => {
        return state.point;
      },
      clearCartItem: (id: string) => {
        clearCartItemById(id);
        // resetQuantity(id);
      },
      addCartItem: (item: Product) => {
        // addLastSaleItem(item);

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
