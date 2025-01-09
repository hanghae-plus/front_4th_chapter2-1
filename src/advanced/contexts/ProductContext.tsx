import React, { createContext, useContext, useState } from "react";

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

interface DiscountInformation {
  isFlashSale: boolean;
  flashSaleProductId: string | null;
  suggestedProductId: string | null;
}

interface ProductState {
  products: Product[];
  selectedProductId: string | null;
  discountInformation: DiscountInformation;
}

interface ProductContextType {
  productState: ProductState;
  setProductState: React.Dispatch<React.SetStateAction<ProductState>>;
}

const initialProductState: ProductState = {
  products: [
    { id: "p1", name: "상품1", price: 10000, stock: 50 },
    { id: "p2", name: "상품2", price: 20000, stock: 30 },
    { id: "p3", name: "상품3", price: 30000, stock: 20 },
    { id: "p4", name: "상품4", price: 15000, stock: 0 },
    { id: "p5", name: "상품5", price: 25000, stock: 10 },
  ],
  selectedProductId: "p1",
  discountInformation: {
    isFlashSale: false,
    flashSaleProductId: null,
    suggestedProductId: null,
  },
};

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [productState, setProductState] =
    useState<ProductState>(initialProductState);

  return (
    <ProductContext.Provider value={{ productState, setProductState }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error("useProduct must be used within a ProductProvider");
  }
  return context;
};
