export const utils = () => {
  // 랜덤 인덱스 값
  const randomIndex = (length) => Math.floor(Math.random() * length);

  return {
    randomIndex,
  };
};
