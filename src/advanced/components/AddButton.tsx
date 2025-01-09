interface AddButtonProps {
  onClick: () => void;
}

export const AddButton = ({ onClick }: AddButtonProps) => {
  return (
    <button
      className='rounded bg-blue-500 px-4 py-2 text-white'
      onClick={onClick}
    >
      추가
    </button>
  );
};
