import { App } from './components/App.js';

const rootElement = document.getElementById('app');
rootElement.innerHTML = '';
rootElement.appendChild(App());
