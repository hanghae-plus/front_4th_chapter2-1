import { DOM_IDS } from "./constants";

function MainAdvanced() {
  return (
    <div className="bg-gray-100 p-8">
      <div className="mx-auto max-w-md overflow-hidden rounded-xl bg-white p-8 shadow-md md:max-w-2xl">
        <h1 className="mb-4 text-2xl font-bold">장바구니</h1>
        <div id={DOM_IDS.CART_ITEMS}>carts</div>
        <div id={DOM_IDS.CART_TOTAL} className="my-4 text-xl font-bold">
          sum
        </div>
        <select id={DOM_IDS.PRODUCT_SELECT} className="mr-2 rounded border p-2">
          select
        </select>
        <button
          id={DOM_IDS.ADD_TO_CART_BTN}
          className="rounded bg-blue-500 px-4 py-2 text-white"
        >
          추가
        </button>
        <div id={DOM_IDS.STOCK_STATUS} className="mt-2 text-sm text-gray-500">
          stockInfo
        </div>
      </div>
    </div>
  );
}

export default MainAdvanced;
