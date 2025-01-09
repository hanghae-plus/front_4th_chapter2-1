import { state } from '../store/globalStore';

function StockInfo() {
  const container = document.createElement('div');

  const getLowStockItems = (prodList) => {
    return prodList.filter((item) => item.volume < 5);
  };

  const render = () => {
    const prodList = state.get('prodList');
    const lowStockItems = getLowStockItems(prodList);

    container.innerHTML = `
      <div id="stock-status" class="text-sm text-gray-500 mt-2" >${lowStockItems
        .map((item) =>
          item.volume > 0
            ? `${item.name}: 재고 부족 (${item.volume}개 남음)`
            : `${item.name}: 품절`
        )
        .join('\n')}</div>
    `;
  };

  state.subscribe('prodList', render);

  render();

  return container;
}

export default StockInfo;
