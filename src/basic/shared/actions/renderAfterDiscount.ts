import { renderBonusPoints } from '../../features/cart/actions/renderBonusPoint';
import { getStockInfo } from '../../features/product/actions/getStockInfo';
import { productList } from '../entity/data/productList';

const renderAfterDiscount = (finalPrice: number, discountRate: number) => {
  const TotalCostView = document.getElementById('cart-total');
  const StockInfoView = document.getElementById('stock-status');
  if (!TotalCostView || !StockInfoView) return;

  TotalCostView.textContent = '총액: ' + Math.round(finalPrice) + '원';
  if (discountRate > 0) {
    const DiscountText = document.createElement('span');
    DiscountText.className = 'text-green-500 ml-2';
    DiscountText.textContent =
      '(' + (discountRate * 100).toFixed(1) + '% 할인 적용)';
    TotalCostView.appendChild(DiscountText);
  }
  StockInfoView.textContent = getStockInfo(productList);
  renderBonusPoints(finalPrice, (PointTag) => {
    TotalCostView.appendChild(PointTag);
  });
};

export { renderAfterDiscount };
