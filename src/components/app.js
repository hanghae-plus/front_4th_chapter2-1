export function createApp() {
  const root = document.getElementById('app');

  const cont = document.createElement('div');
  cont.className = 'bg-gray-100 p-8';
  root.appendChild(cont);

  const wrap = document.createElement('div');
  wrap.className =
    'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8';
  cont.appendChild(wrap);

  return root;
}
