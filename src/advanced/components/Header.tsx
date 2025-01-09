interface Props {
  title: string;
}
export default function Header({ title }: Props) {
  return <h1 className='text-2l font-bold mb-4'>{title}</h1>;
}
