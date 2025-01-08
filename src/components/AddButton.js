export function AddButton() {
  const element = document.createElement('button');
  element.className = 'bg-blue-500 text-white px-4 py-2 rounded';
  element.textContent = '추가';
  element.addEventListener('click', () => {
    console.log('추가 버튼 클릭');
  });

  return {
    getElement: () => element,
  };
}
