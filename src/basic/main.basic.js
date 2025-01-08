import { App } from './components/App.js';
import createState from './hooks/createState.js';

const rootElement = document.getElementById('app');
rootElement.innerHTML = '';
rootElement.appendChild(App());

//전역변수
let lastCount = 0;

const [getLastCount, setLastCount] = createState(0);
