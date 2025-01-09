import { DAYS } from './config.js';

export const isTuesday = () => new Date().getDay() === DAYS.TUESDAY;
