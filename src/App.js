function App(rootElement) {
    const container = document.createElement('div');
    container.className = `bg-gray-100 p-8`;
    container.innerHTML = `
<div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
      <h1 class="text-2xl font-bold mb-4">장바구니</h1>
      <div id="cart-items"></div>
      <div id="product-selection" class="flex items-center"></div>
    </div>`;
    rootElement.appendChild(container);
}

export default App;
