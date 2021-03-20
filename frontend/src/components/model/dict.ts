export type Dict<T extends string | number, R> = {
  // @ts-ignore
  [id: T]: R
};
