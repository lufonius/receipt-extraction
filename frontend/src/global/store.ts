import flyd from 'flyd';
import produce from 'immer';
import Stream = flyd.Stream;
import {distinctUntilChanged} from "./distinct-until-changed";

export type Patch<T> = (draft: T) => void;


// TODO: implement some kind of debugging capability, like setting the type of a patch,
// maybe logging the differences before and after the patch (like jest snapshot comparison)
export abstract class Store<T> {
  constructor(
    private initialState: T,
    private afterInterceptors: Patch<T>[] = []
  ) {}

  private patches: Stream<Patch<T>> = flyd.stream();

  private state: Stream<T> = flyd.scan((state, patch) => {
    const withAfterInterceptors: Patch<T> = (draft: T) => {
      patch(draft);
      this.afterInterceptors.forEach(interceptor => interceptor(draft));
    };
    return produce(state, withAfterInterceptors);
  }, this.initialState, this.patches);

  select<R>(mapFn: (state: T) => R): Stream<R> {
    const mapped: Stream<R> = flyd.map(mapFn, this.state);

    return distinctUntilChanged(mapped);
  }

  patch(patch: Patch<T>): void {
    this.patches(patch);
  }
}
