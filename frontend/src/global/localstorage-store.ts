import {Store} from "./store";

export abstract class LocalstorageStore<T> extends Store<T> {
  constructor(
    initialStateIfNothingInLocalstorage: T,
    localStorageKey: string = "store"
  ) {
    super(
      JSON.parse(localStorage.getItem(localStorageKey)) ?? initialStateIfNothingInLocalstorage,
      [(state: T) => {
          localStorage.setItem(localStorageKey, JSON.stringify(state));
        }]
    );
  }
}
