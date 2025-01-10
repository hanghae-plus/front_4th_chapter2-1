export function createOpt({ value, text, disabled }) {
  const opt = document.createElement('option');
  opt.value = value;
  opt.textContent = text;
  if (disabled) {
    opt.disabled = disabled;
  }

  return opt;
}
