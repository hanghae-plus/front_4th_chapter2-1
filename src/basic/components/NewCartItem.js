export const NewCartItem = (itemToAdd) => {
  const element = document.createElement("div");
  element.id = itemToAdd.id;
  element.className = "flex justify-between items-center mb-2";
  element.innerHTML = `
  <span>${itemToAdd.name} - ${itemToAdd.value}원 x 1</span>
  <div>
    <button 
      class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" 
      data-product-id="${itemToAdd.id}" 
      data-change="-1"
    >
      -
    </button>
    <button 
      class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" 
      data-product-id="${itemToAdd.id}" 
      data-change="1"
    >
      +
    </button>
    <button 
      class="remove-item bg-red-500 text-white px-2 py-1 rounded" 
      data-product-id="${itemToAdd.id}"
    >
      삭제
    </button>
  </div>
`;

  const handleChangeTextContent = (textContent) => {
    element.textContent = textContent;
  };

  const handleChangeSpanTextContent = (textContent) => {
    element.querySelector("span").textContent = textContent;
  };

  const remove = () => {
    element.remove();
  };

  return {
    id: itemToAdd.id,
    element,
    handleChangeTextContent,
    handleChangeSpanTextContent,
    remove,
  };
};
