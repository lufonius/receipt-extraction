import {groupBy} from "./groupBy";

describe("groupBy", () => {
  it("should group by property", () => {
    const array = [
      {
        id: 0,
        status: Test.Hello
      },
      {
        id: 1,
        status: Test.Hello
      },
      {
        id: 2,
        status: Test.World
      }
    ];

    const grouped = groupBy(array, "status");

    expect(grouped[Test.World]).toEqual([
      {
        id: 2,
        status: Test.World
      }
    ]);

    expect(grouped[Test.Hello]).toEqual([
      {
        id: 0,
        status: Test.Hello
      },
      {
        id: 1,
        status: Test.Hello
      },
    ]);
  });
});

enum Test {
  Hello,
  World
}
