export type NonEmptyArray<T> = [T, ...T[]];

export const isNonEmptyArray = <T>(array: T[]): array is NonEmptyArray<T> => {
  return array.length >= 1;
};
