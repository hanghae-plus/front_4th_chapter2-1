export function AddButton({ onClick }) {
  const element = document.createElement('button');
  element.className = 'bg-blue-500 text-white px-4 py-2 rounded';
  element.textContent = '추가';
  element.addEventListener('click', (e) => onClick(e.target.value));

  return {
    getElement: () => element,
  };
}
