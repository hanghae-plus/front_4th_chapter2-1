import { useContext } from "react";
import { ProductListContext } from "../contexts";

export const useProductListContext = () => {
  const context = useContext(ProductListContext);
  if (context === undefined) {
    throw new Error("useProductListContext must be used within an ProductListContextProvider");
  }
  return context;
};
