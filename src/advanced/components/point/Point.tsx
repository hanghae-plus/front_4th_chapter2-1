interface Props {
  point?: number;
}
export default function Point({ point = 0 }: Props) {
  return (
    <span id='loyalty-points' className='text-blue-500 ml-2'>
      (포인트: {point})
    </span>
  );
}
