import type { PropsWithChildren } from 'react';

interface QuantityControlButtonProps {
  onClick: () => void;
}

export const QuantityControlButton = ({ children, onClick }: PropsWithChildren<QuantityControlButtonProps>) => {
  return (
    <button className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" onClick={onClick}>
      {children}
    </button>
  );
};
