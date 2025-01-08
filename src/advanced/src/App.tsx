function App() {
  return (
    <div className="bg-gray-100 p-8">
      <div className="mx-auto max-w-md overflow-hidden rounded-xl bg-white p-8 shadow-md md:max-w-2xl">
        <h1 className="mb-4 text-2xl font-bold">장바구니</h1>
        <div id="cart-items"></div>
        <div id="cart-total" className="my-4 text-xl font-bold"></div>
        <select id="product-select" className="mr-2 rounded border p-2"></select>
        <button id="add-to-cart" className="rounded bg-blue-500 px-4 py-2 text-white">
          추가
        </button>
        <div id="stock-status" className="mt-2 text-sm text-gray-500"></div>
      </div>
    </div>
  );
}

export default App;
