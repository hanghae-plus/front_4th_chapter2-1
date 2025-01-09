import { Container } from './components/Container.js';

export function App() {
  const root = document.getElementById('app');
  // 실제 DOM으로 렌더링해서 붙이는 과정

  root.appendChild(Container().render());
}
