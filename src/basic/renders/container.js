import { createWrapElement } from './warp';

export const createContainerElement = () => {
  const $container = document.createElement('div');
  $container.className = 'bg-gray-100 p-8';

  const $wrap = createWrapElement();
  $container.appendChild($wrap);

  return $container;
};
