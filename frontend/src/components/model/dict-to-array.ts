import {Dict} from "./dict";

export const dictToArray = <T>(dict: Dict<number, T>): T[] => Object.keys(dict).map(key => dict[key]);
