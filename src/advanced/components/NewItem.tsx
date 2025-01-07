import { INITIAL_QUANTITY } from "advanced/constants";

interface Item {
  name?: string;
  price?: number;
}

export const NewItem = ({ name, price }: Item) => {
  if (!name || !price) return;

  return [
    <span>
      ${name} - ${price}원 x ${INITIAL_QUANTITY}
    </span>,
    <div>
      <button
        className="quantity-change mr-1 rounded bg-blue-500 px-2 py-1 text-white"
        data-product-id="${id}"
        data-change="-1"
      >
        -
      </button>
      <button
        className="quantity-change mr-1 rounded bg-blue-500 px-2 py-1 text-white"
        data-product-id="${id}"
        data-change="1"
      >
        +
      </button>
      <button
        className="remove-item rounded bg-red-500 px-2 py-1 text-white"
        data-product-id="${id}"
      >
        삭제
      </button>
    </div>,
  ];
};
