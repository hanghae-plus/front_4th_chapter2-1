import { combineStyles } from "../../utils";
import CartHeader from "./components/CartHeader";
import CartItem from "./components/CartList/CartItem";
import CartSummary from "./components/CartList/CartSummary";
import ProductSelect from "./components/ProductSelect";
import ProductAddButton from "./components/ProductAddButton";
import StockInformation from "./components/StockInformation";

const Cart = () => {
  const cartContainerStyles = combineStyles("bg-gray-100", "p-8");
  const cartWrapperStyles = combineStyles(
    "max-w-md",
    "mx-auto",
    "bg-white",
    "rounded-xl",
    "shadow-md",
    "overflow-hidden",
    "md:max-w-2xl",
    "p-8",
  );

  return (
    <div className={cartContainerStyles}>
      <div className={cartWrapperStyles}>
        <CartHeader />
        <CartItem />
        <CartSummary />
        <ProductSelect />
        <ProductAddButton />
        <StockInformation />
      </div>
    </div>
  );
};

export default Cart;
