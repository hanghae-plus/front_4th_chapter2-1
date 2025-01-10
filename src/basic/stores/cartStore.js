export default function cartStore() {
  let totalAmount = 0;
  let itemCounts = 0;

  const addItemCount = (quantity) => {
    state.itemCounts += quantity;
  };

  const addTotalAmount = (amount) => {
    totalAmount += amount;
  };

  return {
    totalAmount,
    itemCounts,
    addItemCount,
    addTotalAmount,
  };
}
