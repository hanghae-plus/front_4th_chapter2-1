export const getChangeButtonType = ($target: HTMLElement): 'minus-one' | 'plus-one' => {
  if ($target.classList.contains('remove-item')) return 'minus-one';

  if ($target.classList.contains('quantity-change')) return 'plus-one';

  throw Error('잘못된 버튼입니다.');
};
