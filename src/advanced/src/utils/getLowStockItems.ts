import { Item } from '../types';

export const getLowStockItems = (prodList: Item[]) => {
  return prodList.filter((item) => item.volume < 5);
};
