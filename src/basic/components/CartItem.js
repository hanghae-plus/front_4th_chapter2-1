export function createCartItem(product) {
  const item = document.createElement("div");
  item.id = product.id;
  item.className = "flex justify-between items-center mb-2";

  item.innerHTML = `
      <span>${product.name} - ${product.val}원 x 1</span>
      <div>
        <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" 
          data-product-id="${product.id}" data-change="-1">-</button>
        <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" 
          data-product-id="${product.id}" data-change="1">+</button>
        <button class="remove-item bg-red-500 text-white px-2 py-1 rounded" 
          data-product-id="${product.id}">삭제</button>
      </div>
    `;

  return item;
}
