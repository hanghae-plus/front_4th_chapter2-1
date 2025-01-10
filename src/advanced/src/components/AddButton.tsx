import { Button } from './common';

interface AddButtonProps {
  onClick?: () => void;
}

export function AddButton({ onClick }: AddButtonProps) {
  return (
    <Button id="add-to-cart" className="bg-blue-500 text-white px-4 py-2 rounded" onClick={onClick}>
      추가
    </Button>
  );
}
