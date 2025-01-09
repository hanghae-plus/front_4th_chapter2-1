import { createContext, JSX } from "react";
import { Product } from "../types";
import { useCart, useStock } from "../hooks";

interface CartContextType {
  shoppingCart: Product[];
  cartTotalPrice: number;
  cartCount: number;
  discountRate: number;
  getCartProductById: (id: string) => Product | undefined;
  addToCart: (product: Product) => void;
  removeCart: (id: string) => void;
  increaseCart: (id: string) => void;
  decreaseCart: (id: string) => void;
}

interface StockContextType {
  products: Product[];
  getLowStockMessage: () => string;
  getStockProductById: (id: string) => Product | undefined;
  increaseStock: (id: string) => void;
  decreaseStock: (id: string) => void;
}

interface ProductListContextType extends CartContextType, StockContextType {}

export const ProductListContext = createContext<ProductListContextType | undefined>(undefined);

export function ProductListContextProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const { shoppingCart, cartTotalPrice, cartCount, discountRate, getCartProductById, addToCart, removeCart, increaseCart, decreaseCart } = useCart();
  const { products, getLowStockMessage, getStockProductById, increaseStock, decreaseStock } = useStock();

  const productListContextValue: ProductListContextType = {
    shoppingCart,
    cartTotalPrice,
    cartCount,
    discountRate,
    getCartProductById,
    addToCart,
    removeCart,
    increaseCart,
    decreaseCart,
    products,
    getLowStockMessage,
    getStockProductById,
    increaseStock,
    decreaseStock,
  };
  return <ProductListContext.Provider value={productListContextValue}>{children}</ProductListContext.Provider>;
}
