import { updateProductSelectOptions } from './updateProductSelectOptions.ts';
import { getRandomNumber } from '../utils/radom.ts';
import { productStore } from '../stores/productStore.ts';
import { cloneDeep } from '../utils/object.ts';

export const applyRandomDiscount = ($select: HTMLSelectElement) => {
  const { setState } = productStore;

  const newProductList = cloneDeep(productStore.getState());

  const luckyItem = newProductList[getRandomNumber(0, newProductList.length)];

  setState(newProductList);

  if (Math.random() < 0.3 && luckyItem.q > 0) {
    luckyItem.val = Math.round(luckyItem.val * 0.8);
    alert('번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!');
    updateProductSelectOptions($select);
  }
};
