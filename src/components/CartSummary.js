export function CartSummary({ cartItems }) {
  const element = document.createElement('div');
  element.className = 'text-xl font-bold my-4';

  const calSummary = () => {
    let total = 0;

    cartItems.forEach(({ product, quantity }) => {
      const itemTotal = product.price * quantity;
      const discount = 0;
      total += itemTotal * (1 - discount);
    });

    const points = Math.floor(total / 1000);

    return { total, points };
  };

  const render = () => {
    const { total, points } = calSummary();
    element.innerHTML = `
      총액 : ${total}원
      <span class="text-blue-500 ml-2">(포인트: ${points})</span>
    `;
  };

  return {
    getElement: () => element,
    render,
  };
}
