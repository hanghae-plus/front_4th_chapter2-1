export function createSel() {
  const sel = document.createElement('select');
  sel.id = 'product-select';
  sel.className = 'border rounded p-2 mr-2';

  return sel;
}
