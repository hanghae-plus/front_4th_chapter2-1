export const TotalPrice = () => {
  // mock 변수선언
  const totalAmt = 30000;
  const discRate = 1000;

  const isShowDiscount = discRate > 0;

  return `
  <div class="text-xl font-bold my-4">
  총액: ${Math.round(totalAmt)} 원
  ${
    isShowDiscount &&
    `<span class="text-green-500 ml-2">
  (${(discRate * 100).toFixed(1)}% 할인 적용)
    </span>`
  }
  </div>
  `;
};
