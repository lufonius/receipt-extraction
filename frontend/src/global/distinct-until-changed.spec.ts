import flyd from "flyd";
import filter from "flyd/module/filter";
import { distinctUntilChanged } from "./distinct-until-changed";

function over5(n) {
  return n > 5;
}

describe('distinctUntilChanged', function() {

  it('should only let values through which changed using the === comparator', function() {
    var result = [];
    var numbers = flyd.stream();
    var largeNumbers = distinctUntilChanged(numbers);

    flyd.map(function(n) {
      result.push(n);
    }, largeNumbers);

    numbers(2)(2)(3)(4)(5)(5)(5)(10)(5)(10)(10)(67);

    console.log(result);

    expect(result).toEqual([2, 3, 4, 5, 10, 5, 10, 67])
  });
});
