import {Constructable} from "./constructable";
import "reflect-metadata";

export class Container {
  private instances = new Map<Constructable, any>();

  getInstance<T>(constructable: Constructable<T>): T {
    return this.createInstance(constructable);
  }

  private createInstance<T>(constructable: Constructable<T>): T {
    let instance = this.instances.get(constructable);
    if (!!instance) {
      return instance;
    } else {
      let instances = [];
      if (Reflect.hasMetadata('design:paramtypes', constructable)) {
        const constructables: Array<Constructable> = Reflect.getMetadata('design:paramtypes', constructable);
        instances = constructables.map(constructable => this.createInstance(constructable));
      }

      const currentInstance = new constructable(...instances);
      this.instances.set(constructable, currentInstance);
      return currentInstance;
    }
  }
}
