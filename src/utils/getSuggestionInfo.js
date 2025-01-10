import { getOptionsHTML } from './getOptionsHTML';

export function getSuggestionInfo({ state }) {
  if (state.lastSel == null) {
    return null;
  }

  const suggest = state.prodList.find(function (item) {
    return item.id != state.lastSel && item.q > 0;
  });

  if (suggest == null) {
    return null;
  }

  return {
    optionsHTML: getOptionsHTML({ prodList: state.prodList }),
    message: suggest.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!',
  };
}
