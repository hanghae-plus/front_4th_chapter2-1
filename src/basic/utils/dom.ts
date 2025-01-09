interface HTMLAttributes {
  className?: string;
  id?: string;
  textContent?: string;
  value?: string | number;
}

export const createElement = (tagName: keyof HTMLElementTagNameMap, attr?: HTMLAttributes): HTMLElement => {
  const $el: any = document.createElement(tagName);

  Object.entries(attr ?? {}).forEach(([key, value]) => {
    $el[key] = value;
  });

  return $el;
};

export const appendChildren = ($parent: HTMLElement, $children: HTMLElement[]) => {
  $children.forEach(($child) => $parent.appendChild($child));
};
