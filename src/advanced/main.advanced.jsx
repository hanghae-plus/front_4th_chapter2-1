import ReactDOM from 'react-dom/client'; // 이 경로를 사용해야 합니다.
import React from 'react';

const domContainer = document.querySelector('#app');
const root = ReactDOM.createRoot(domContainer);
root.render(<Main />); // React.createElement 사용

function Main() {
  return <div>감동의쓰나미~!!!</div>;
}
