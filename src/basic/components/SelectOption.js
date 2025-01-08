import { handleAddToCart } from '../events/CartEventHandler';
import { state } from '../store/globalStore';

function SelectOption() {
  const container = document.createElement('div');

  const render = () => {
    const prodList = state.get('prodList');

    const selectedId = document.querySelector('#product-select')?.value || '';

    container.innerHTML = `
    <select id="product-select" class="border rounded p-2 mr-2">
    ${prodList.map((it) => {
      return `<option value="${it.id}" ${it.volume === 0 ? 'disabled' : ''} ${
        it.id === selectedId ? 'selected' : ''
      }>${it.name} - ${it.price}원</option>`;
    })}
    </select>
    <button id="add-to-cart" class="bg-blue-500 text-white px-4 py-2 rounded">추가</button>
    `;

    const addBtn = container.querySelector('#add-to-cart');
    addBtn.addEventListener('click', handleAddToCart);
  };

  render();

  state.subscribe('prodList', render);

  return container;
}

export default SelectOption;
