import Point from '../point/Point';

interface Props {
  amount?: number;
  point?: number;
}
export default function CartTotal({ amount = 0, point = 0 }: Props) {
  return (
    <div id='cart-total' className='text-xl font-bold my-4'>
      총액: {amount}원 <Point point={point} />
    </div>
  );
}
