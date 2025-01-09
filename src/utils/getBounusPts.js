import { createPtsTag } from '../components/ptsTag';

export const getBonusPts = ({ totalAmt }) => {
  return createPtsTag({ bonusPts: Math.floor(totalAmt / 1000) });
};
