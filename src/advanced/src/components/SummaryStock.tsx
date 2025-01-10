import { FunctionComponent } from "react";
import { IProduct } from "../types/types";
interface ISummaryStock {
  products: IProduct[];
}

const SummaryStock: FunctionComponent<ISummaryStock> = ({ products }) => {
  return (
    <>
      {products.map((product, idx) => {
        if (product.stock < 5) {
          return (
            <div
              key={"stock-status"}
              id="stock-status"
              className="text-sm text-gray-500 mt-2"
            >
              {product.name}:{" "}
              {product.stock > 0
                ? "재고 부족 (" + product.stock + "개 남음)"
                : "품절"}
            </div>
          );
        }
        return;
      })}
    </>
  );
};
export default SummaryStock;
