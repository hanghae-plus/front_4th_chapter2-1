import { PRODUCT_LIST } from '../types/constant';

export const Stock = () => {
  const defaultStock = PRODUCT_LIST.filter((item) => item.stock <= 5)
    .map((item) => `${item.name}: 품절`)
    .join('\n');

  const stockStatusMsg = `${defaultStock}\n`;

  return (
    <div id="stock-status" className="mt-2 text-sm text-gray-500">
      {stockStatusMsg}
    </div>
  );
};
