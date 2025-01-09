import { create } from 'zustand';
import { PRODUCT_LIST_MOCK } from '../mock/productMock.js';
import {
  DISCOUNT_RATES,
  LOYALTY_DAY,
  MIN_BULK_COUNT,
  MIN_ITEM_COUNT_FOR_DISCOUNT,
  ProductId,
} from '../constants/discount';
import { Product } from '../types/Product';

export interface CartItem extends Product {
  quantity: number;
}

interface ProductStore {
  totalPrice: number;
  discountRate: number;
  productList: Product[];
  cartList: CartItem[];
  lastSelectedProductId: string | null;
  calculateCart: () => void;
  setSelectedProduct: (productId: string) => void;
  addToCart: (productId: string) => void;
  updateQuantity: (productId: string, quantityChange: number) => void;
  updateProductPrice: (productId: string, newPrice: number) => void;
  removeToCart: (productId: string) => void;
}

export const useCartStore = create<ProductStore>((set, get) => ({
  totalPrice: 0,
  discountRate: 0,
  productList: PRODUCT_LIST_MOCK,
  cartList: [],
  lastSelectedProductId: null,
  // ==================== || ACTIONS || ==================== //
  setSelectedProduct: (productId) =>
    set((state) => ({ ...state, lastSelectedProductId: productId })),
  addToCart: (productId) => {
    set((state) => {
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
    });

    get().calculateCart();
  },
  updateQuantity: (productId, quantityChange) => {
    set((state) => {
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
    });

    get().calculateCart();
  },
  updateProductPrice: (productId, newPrice) =>
    set((state) => {
      const updatedProductList = state.productList.map((product) =>
        product.id === productId ? { ...product, price: newPrice } : product
      );

      return { ...state, productList: updatedProductList };
    }),
  removeToCart: (productId) => {
    set((state) => {
      const cartItem = state.cartList.find((c) => c.id === productId);
      if (!cartItem) return state;

      const updatedProductList = state.productList.map((p) =>
        p.id === productId ? { ...p, quantity: p.quantity + cartItem.quantity } : p
      );

      const updatedCartList = state.cartList.filter((c) => c.id !== productId);

      return { ...state, productList: updatedProductList, cartList: updatedCartList };
    });

    get().calculateCart();
  },
  // ==================== || COMPUTED || ==================== //
  calculateCart: () => {
    const { productList, cartList } = get();

    let totalPrice = 0;
    let totalTemp = 0;
    let itemCount = 0;

    cartList.forEach((cartItem) => {
      const product = productList.find((p) => p.id === cartItem.id);
      if (!product) return;

      const currentItemCount = cartItem.quantity;
      const itemTotalPrice = product.price * currentItemCount;
      totalTemp += itemTotalPrice;
      itemCount += currentItemCount;

      let discount = 0;
      if (currentItemCount >= MIN_ITEM_COUNT_FOR_DISCOUNT) {
        discount = DISCOUNT_RATES.PRODUCT[product.id as ProductId] || 0;
      }

      totalPrice += itemTotalPrice * (1 - discount);
    });

    let discountRate;
    if (itemCount >= MIN_BULK_COUNT) {
      const bulkDisc = totalPrice * DISCOUNT_RATES.BULK_PURCHASE;
      const itemDisc = totalTemp - totalPrice;

      if (bulkDisc > itemDisc) {
        totalPrice = totalTemp * (1 - DISCOUNT_RATES.BULK_PURCHASE);
        discountRate = DISCOUNT_RATES.BULK_PURCHASE;
      } else {
        discountRate = (totalTemp - totalPrice) / totalTemp;
      }
    } else {
      discountRate = (totalTemp - totalPrice) / totalTemp;
    }

    if (new Date().getDay() === LOYALTY_DAY) {
      totalPrice *= 1 - DISCOUNT_RATES.LOYALTY_DAY;
      discountRate = Math.max(discountRate, DISCOUNT_RATES.LOYALTY_DAY);
    }

    set({
      totalPrice: Math.round(totalPrice),
      discountRate: discountRate * 100,
    });
  },
}));
