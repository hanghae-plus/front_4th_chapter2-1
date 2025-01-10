import { FunctionComponent } from "react";
import { IProduct } from "../types/types";
interface IProductSelect {
  products: IProduct[];
  handler: (productId: string) => void;
}

const ProductSelect: FunctionComponent<IProductSelect> = ({
  products,
  handler,
}: IProductSelect) => {
  const handlerSelect = () => {
    handler("test");
  };
  const handlerAddToCart = () => {
    console.log("addToCart");
  };
  return (
    <>
      <select
        id="product-select"
        className="border rounded p-2 mr-2"
        onChange={handlerSelect}
      >
        {products.map((element) => {
          return (
            <option key={element.id} disabled={element.stock === 0}>
              {element.name}-{element.cost}원
            </option>
          );
        })}
      </select>
      <button
        id="add-to-cart"
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={handlerAddToCart}
      >
        추가
      </button>
    </>
  );
};

export default ProductSelect;
