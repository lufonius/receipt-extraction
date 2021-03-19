import flyd from 'flyd';
import Stream = flyd.Stream;

export const distinctUntilChanged = <T> (s: Stream<T>): Stream<T> => {
  let last;

  return flyd.combine(function(s, self) {
    const current = s();
    if (last !== current) {
      last = current;
      self(s.val);
    }
  }, [s]);
};
