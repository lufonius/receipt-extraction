import flyd from 'flyd';
import produce from 'immer';
import Stream = flyd.Stream;

export type Patch<T> = (draft: T) => void;

export type Dict<T extends string | number, R> = {
  // @ts-ignore
  [id: T]: R
};


// TODO: implement some kind of debugging capability, like setting the type of a patch,
// maybe logging the differences before and after the patch (like jest snapshot comparison)
export abstract class Store<T> {
  constructor(private initialState: T) {}

  private patches: Stream<Patch<T>> = flyd.stream();

  private state: Stream<T> = flyd.scan((state, patch) => {
    return produce(state, patch);
  }, this.initialState, this.patches);

  select<R>(mapFn: (state: T) => R): Stream<R> {
    return flyd.map(mapFn, this.state);
  }

  patch(patch: Patch<T>): void {
    this.patches(patch);
  }
}
