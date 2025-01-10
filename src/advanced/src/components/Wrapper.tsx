import { AddButton, CartDisplay, SelectedProd, StockInfo, TItle, TotalAmount } from './index';

export function Wrapper() {
  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
      <TItle />
      <CartDisplay />
      <TotalAmount />
      <SelectedProd />
      <AddButton />
      <StockInfo />
    </div>
  );
}
