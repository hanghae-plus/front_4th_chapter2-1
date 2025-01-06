import { state } from '../store/globalStore';

function SelectOption() {
  const prodSelect = document.getElementById('product-select');
  if (!prodSelect) return;

  const prodList = state.get('prodList');

  state.subscribe('prodList', updateSelectUI);
  updateSelectUI(prodSelect, prodList);
}

const updateSelectUI = (prodSelect, prodList) => {
  clearSelectOptions(prodSelect);
  prodList.forEach((product) => {
    const selectOptionTag = createSelectOption(product);
    prodSelect.appendChild(selectOptionTag);
  });
};

const createSelectOption = (product) => {
  const selectOptionTag = document.createElement('option');
  selectOptionTag.value = product.id;
  selectOptionTag.textContent = `${product.name} - ${product.price}원`;

  if (product.volume === 0) {
    selectOptionTag.disabled = true;
  }

  return selectOptionTag;
};

const clearSelectOptions = (selectElement) => {
  selectElement.innerHTML = '';
};

export default SelectOption;
