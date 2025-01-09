export const newItem = (itemToAdd) => {
  const itemDiv = document.createElement("div");
  itemDiv.id = itemToAdd.id;
  itemDiv.className = "flex justify-between items-center mb-2";

  const itemSpan = document.createElement("span");
  itemSpan.textContent = `${itemToAdd.name} - ${itemToAdd.val}원 x 1`;

  const buttonContainer = document.createElement("div");

  const createButton = (text, className, dataChange) => {
    const button = document.createElement("button");
    button.className = className;
    button.textContent = text;
    button.dataset.productId = itemToAdd.id;
    console.log(button.dataset.productId);
    if (dataChange) {
      button.dataset.change = dataChange;
    }
    return button;
  };

  const minusButton = createButton(
    "-",
    "quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1",
    "-1"
  );
  const plusButton = createButton(
    "+",
    "quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1",
    "1"
  );
  const removeButton = createButton(
    "삭제",
    "remove-item bg-red-500 text-white px-2 py-1 rounded"
  );

  buttonContainer.appendChild(minusButton);
  buttonContainer.appendChild(plusButton);
  buttonContainer.appendChild(removeButton);

  itemDiv.appendChild(itemSpan);
  itemDiv.appendChild(buttonContainer);

  return itemDiv;
};
