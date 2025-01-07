import { Product } from '../types/Product';

const renderProductOptionsView = (
  SelectView: HTMLSelectElement,
  productList: Product[],
) => {
  SelectView.innerHTML = '';
  productList.forEach(function (item) {
    const OptionView = document.createElement('option');
    OptionView.value = item.id;
    OptionView.textContent = item.name + ' - ' + item.price + '원';
    if (item.quantity === 0) OptionView.disabled = true;
    SelectView.appendChild(OptionView);
  });
};

export { renderProductOptionsView };
