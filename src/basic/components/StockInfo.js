import { state } from '../store/globalStore';

function StockInfo() {
  const updateStockInfoUI = () => {
    const prodList = state.get('prodList');
    const lowStockItems = getLowStockItems(prodList);

    const stockInfoContent = generateStockInfoContent(lowStockItems);
    const stockInfoElement = document.getElementById('stock-status');

    if (stockInfoElement) {
      stockInfoElement.textContent = stockInfoContent;
    }
  };

  const getLowStockItems = (prodList) => {
    return prodList.filter((item) => item.volume < 5);
  };

  const generateStockInfoContent = (lowStockItems) => {
    return lowStockItems
      .map((item) =>
        item.volume > 0
          ? `${item.name}: 재고 부족 (${item.volume}개 남음)`
          : `${item.name}: 품절`
      )
      .join('\n');
  };

  state.subscribe('prodList', updateStockInfoUI);

  updateStockInfoUI();
}

export default StockInfo;
