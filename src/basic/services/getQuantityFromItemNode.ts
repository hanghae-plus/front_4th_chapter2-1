export const getQuantityFromItemNode = (itemNode: HTMLElement) => {
  const value = itemNode?.querySelector('span')?.textContent?.split('x ')[1];

  if (!value) throw Error('itemNode 에 수량이 없습니다.');

  return parseInt(value);
};
