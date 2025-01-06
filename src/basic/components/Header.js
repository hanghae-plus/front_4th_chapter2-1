/**
 * 헤더 엘레먼트 생성
 * @param {*} { title }: { title: string } - 제목
 * @returns {HTMLElement} 헤더 엘레먼트
 */
export default function Header({ title }) {
  const headerElement = document.createElement('h1');
  headerElement.className = 'text-2xl font-bold mb-4';
  headerElement.textContent = title;
  return headerElement;
}
