import {Constructable} from "./constructable";

export function Inject(type: Constructable) {
  return (target: any, propertyKey: string) => {
    target[propertyKey] = window.container.getInstance(type);
  };
}
