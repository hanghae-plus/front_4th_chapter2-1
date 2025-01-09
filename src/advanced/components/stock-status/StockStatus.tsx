interface Props {
  message?: string;
}
export default function StockStatus({ message = '' }: Props) {
  return (
    <div id='stock-status' className='text-sm text-gray-500 mt-2'>
      {message}
    </div>
  );
}
