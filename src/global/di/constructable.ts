export interface Constructable<T=any> {
  new (...params): T;
}
