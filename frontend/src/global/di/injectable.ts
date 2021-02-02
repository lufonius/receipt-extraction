import {Constructable} from "./constructable";
import 'reflect-metadata';

export function Injectable(constructable: Constructable): Constructable {
  return constructable;
}
