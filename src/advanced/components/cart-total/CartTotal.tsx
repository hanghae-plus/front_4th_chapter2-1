import { PropsWithChildren } from 'react';
import Point from '../point/Point';

interface Props {
  amount?: number;
  point?: number;
}
export default function CartTotal({ amount = 0, point = 0, children }: PropsWithChildren<Props>) {
  return (
    <div id='cart-total' className='my-4 text-xl font-bold'>
      총액: {amount}원 <Point point={point} />
      {children}
    </div>
  );
}
