interface CreateElementProps<T extends keyof HTMLElementTagNameMap> {
  tag: T;
  id?: string;
  className?: string;
  textContent?: string;
  value?: string | number;
  innerHTML?: string;
}

export function createStyledElement<T extends keyof HTMLElementTagNameMap>({
  tag,
  id,
  className,
  textContent,
  value,
  innerHTML,
}: CreateElementProps<T>): HTMLElementTagNameMap[T] {
  const element = document.createElement(tag);

  if (id) element.id = id;
  if (className) element.className = className;
  if (tag === 'option' && value) {
    (element as HTMLOptionElement).value = value as string;
  }
  if (tag === 'select' && value) {
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
