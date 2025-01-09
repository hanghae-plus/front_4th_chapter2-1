import { html } from '../libs/index.js';
import { Title, CartDisplay, TotalAmount, SelectedProd, AddButton, StockInfo } from './index.js';
import { updateSelectableOptionsDisplay } from '../utils/index.js';
import { prodList } from '../store/index.js';

export function Wrapper() {
  const SelectedProdComponent = SelectedProd();

  updateSelectableOptionsDisplay({ component: SelectedProdComponent, items: prodList });

  return html`
    <div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
      ${Title()} ${CartDisplay()} ${TotalAmount()} ${SelectedProdComponent} ${AddButton()} ${StockInfo()}
    </div>
  `;
}
