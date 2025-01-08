function Point(totalAmt) {
  const container = document.createElement('div');

  const render = () => {
    const bonusPoint = Math.floor(totalAmt / 1000);

    container.innerHTML = `
      <span id="loyalty-points" class="text-blue-500 ml-2">(포인트: ${bonusPoint})</span>
    `;
  };

  render();

  return container;
}

export default Point;

//Total에 병함 삭제 페이지
