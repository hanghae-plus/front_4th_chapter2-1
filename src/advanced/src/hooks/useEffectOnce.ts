import { EffectCallback, useEffect, useRef } from 'react';

export const useEffectOnce = (callback: EffectCallback) => {
  const preserveCallback = useRef(callback).current;

  useEffect(preserveCallback, [preserveCallback]);
};
