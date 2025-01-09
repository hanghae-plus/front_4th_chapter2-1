import { POINT_RATIO } from './config.js';

export const calculatePoints = (totalAmount) =>
  Math.floor(totalAmount / POINT_RATIO);
export const formatPointsMessage = (points) => `(포인트: ${points})`;
