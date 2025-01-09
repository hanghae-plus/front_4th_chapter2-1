import { html } from '../libs/index.js';
import { Title, CartDisplay, TotalAmount, SelectedProd, AddButton, StockInfo } from './index.js';
import { calculateCart, updateBonusPointsDisplay, updateSelectableOptionsDisplay, updateStockInfoDisplay } from '../utils/index.js';
import { prodList } from '../store/index.js';

export function Wrapper() {
  const SelectedProdComponent = SelectedProd();
  const cartDisplayComponent = CartDisplay();
  const stockInfoComponent = StockInfo();
  const totalAmountComponent = TotalAmount();

  const { totalAmount } = calculateCart({ cartDisplayComponent: cartDisplayComponent, prodList });

  updateSelectableOptionsDisplay({ selectedPropComponent: SelectedProdComponent, items: prodList });
  updateStockInfoDisplay({ StockInfoComponent: stockInfoComponent, prodList });
  updateBonusPointsDisplay({ totalAmountComponent: totalAmountComponent, totalAmount });

  return html`
    <div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
      ${Title()} ${cartDisplayComponent} ${totalAmountComponent} ${SelectedProdComponent} ${AddButton()} ${stockInfoComponent}
    </div>
  `;
}
