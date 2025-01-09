import { MouseEvent } from 'react';

interface Props {
  handleClick: (e: MouseEvent<HTMLButtonElement>) => void;
  productId: string;
}
export default function CartAddButton({ handleClick, productId }: Props) {
  return (
    <button
      id='add-to-cart'
      className='px-4 py-2 text-white bg-blue-500 rounded'
      data-id={productId}
      onClick={handleClick}
    >
      추가
    </button>
  );
}
