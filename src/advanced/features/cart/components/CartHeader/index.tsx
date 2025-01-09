import React from "react";
import { combineStyles } from "../../../../utils";

const CartHeader = () => {
  const cartHeaderStyles = combineStyles("text-2xl", "font-bold", "mb-4");

  return <h1 className={cartHeaderStyles}>장바구니</h1>;
};

export default CartHeader;
