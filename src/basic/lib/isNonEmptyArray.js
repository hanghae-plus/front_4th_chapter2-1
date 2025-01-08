// @ts-check

/**
 * @template T
 * @typedef {[T, ...T[]]} NonEmptyArray
 */

/**
 * @template T
 * @param {T[]} array
 * @returns {array is NonEmptyArray<T>}
 */
export const isNonEmptyArray = (array) => {
  return array.length >= 1;
};
