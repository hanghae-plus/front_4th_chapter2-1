import { Container } from './components/Container';

export default function main() {
  const root = document.getElementById('app');
  root.innerHTML = Container();
}

main();
