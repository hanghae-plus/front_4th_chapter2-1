export function createPtsTag({ bonusPts }) {
  const ptsTag = document.createElement('span');
  ptsTag.id = 'loyalty-points';
  ptsTag.className = 'text-blue-500 ml-2';
  ptsTag.textContent = '(포인트: ' + bonusPts + ')';

  return ptsTag;
}
