import { getOptionsHTML } from './getOptionsHTML';

export function getLuckyEventInfo({ prodList }) {
  const luckyItem = prodList[Math.floor(Math.random() * prodList.length)];
  if (Math.random() >= 0.3 || luckyItem.q <= 0) {
    return null;
  }

  luckyItem.val = Math.round(luckyItem.val * 0.8);

  return {
    optionsHTML: getOptionsHTML({ prodList }),
    message: '번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!',
  };
}
