type AddToCartButtonProps = {
  onClickButton: () => void;
};
export const AddToCartButton = ({ onClickButton }: AddToCartButtonProps) => {
  return (
    <button
      id="add-to-cart"
      className="bg-blue-500 text-white px-4 py-2 rounded"
      onClick={onClickButton}
    >
      추가
    </button>
  );
};
