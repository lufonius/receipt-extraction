import {Dict} from "./dict";

export const arrayToDict = <T extends { id: number }>(arr: T[], key: keyof T): Dict<number, T> => {
  return arr.reduce((acc, curr) => {
    // @ts-ignore
    acc[curr[key]] = curr;
    return acc;
  }, {});
};
