import { DOM_IDS } from "./../constants/domIds";

export const RewardPoints = (finalPrice: number) => {
  const point = Math.floor(finalPrice / 1000);

  return (
    <span id={DOM_IDS.LOYALTY_POINTS} className="ml-2 text-blue-500">
      (포인트: ${point})
    </span>
  );
};
