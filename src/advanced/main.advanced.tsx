import { createRoot } from 'react-dom/client';
import App from './App';

const $root = document.getElementById('app');

if (!$root) throw new Error('Failed to find the root element');

const root = createRoot($root);
root.render(<App />);
