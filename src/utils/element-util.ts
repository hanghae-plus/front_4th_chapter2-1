interface CreateElementProps {
  tag: string;
  id?: string;
  className?: string;
  textContent?: string;
  value?: string | number;
  innerHTML?: string;
}

export function createStyledElement({
  tag,
  id,
  className,
  textContent,
  value,
  innerHTML,
}: CreateElementProps): HTMLElement {
  const element = document.createElement(tag);

  if (id) element.id = id;
  if (className) element.className = className;
  if (tag === 'option' && value) {
    (element as HTMLSelectElement).value = value as string;
  }
  if (textContent) element.textContent = textContent;
  if (innerHTML) element.innerHTML = innerHTML;

  return element;
}

export function createChildElement(
  parent: HTMLElement,
  child: HTMLElement
): HTMLElement {
  const childElement = parent.appendChild(child);
  return childElement;
}
