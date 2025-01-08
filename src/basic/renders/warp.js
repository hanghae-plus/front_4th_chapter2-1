export const createWrapElement = () => {
  const $wrap = document.createElement('div');
  $wrap.className =
    'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8';
  return $wrap;
};
