import { FunctionComponent } from "react";
import { ICart, IProduct } from "../types/types";
interface ICartList {
  products: ICart[];
}
const CartList: FunctionComponent<ICartList> = ({ products }) => {
  return (
    <div>
      {products.map((product, idx) => {
        return <CartItem key={product.id} item={product} />; // key를 고유 ID로 지정
      })}
    </div>
  );
};

interface ICartItem {
  item: ICart;
}

const CartItem: FunctionComponent<ICartItem> = ({ item }) => {
  return (
    <div id={item.id} className="flex justify-between items-center mb-2">
      <span>
        {item.name} - {item.cost}원 x {item.count}
      </span>
      <div>
        <button
          className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
          data-product-id={item.id}
          data-change="-1"
        >
          -
        </button>
        <button
          className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
          data-product-id={item.id}
          data-change="1"
        >
          +
        </button>
        <button
          className="remove-item bg-red-500 text-white px-2 py-1 rounded"
          data-product-id={item.id}
        >
          삭제
        </button>
      </div>
    </div>
  );
};

export default CartList;
