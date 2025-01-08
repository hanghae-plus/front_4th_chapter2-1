export const createHeaderElement = () => {
  const $header = document.createElement('h1');
  $header.className = 'text-2xl font-bold mb-4';
  $header.textContent = '장바구니';

  return $header;
};
