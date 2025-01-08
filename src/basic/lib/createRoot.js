// @ts-check
import { createObserver } from './createObserver';

/**
 * @param {HTMLElement | null} container
 * @param {(container: HTMLElement) => void} render
 * @returns
 */
export const createRoot = (container, render) => {
  if (!container) {
    throw Error('Target container is not a DOM element.');
  }

  const { subscribe } = createObserver();

  subscribe(() => render(container));
  render(container);
};
