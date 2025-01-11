import ReactDOM from 'react-dom/client';
import React from 'react';
import { Cart } from './components/Cart';

const domContainer = document.querySelector('#app');
const root = ReactDOM.createRoot(domContainer);
root.render(<Main />);

function Main() {
  return (
    <div className="bg-gray-100 p-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
        <div className="text-2xl font-bold mb-4">장바구니</div>
        <Cart />
      </div>
    </div>
  );
}
