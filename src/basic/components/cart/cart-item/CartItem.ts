interface CartItemProps {
  id: string;
  name: string;
  val: number;
  q: number;
}

export const CartItem = (props) => {
  const { id, name, val, q } = props;

  const render = `
    <div id=${id} class="flex justify-between items-center mb-2">
        <span>
         ${name} - ${val}원 x 1
        </span>
        <div>
        <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id=${id} data-change="1">+</button>
        <button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id=${id}>삭제</button>
        </div>
    </div>
  `;
};
