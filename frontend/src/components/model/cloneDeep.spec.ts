import {cloneDeep} from "./cloneDeep";

describe("deepclone", () => {
  it("should deeply clone an object", () => {
    const toBeCloned = {
      someNestedProp: {
        someOtherNestedPrimitive: "hello"
      },
      someNestedArray: [
        { id: 6 },
        {
          nestedPropInArray: [{ id: 8 }]
        }
      ],
      simple: "noot"
    };

    const cloned = cloneDeep(toBeCloned);

    expect(cloned).toEqual(toBeCloned);
    cloned.someNestedProp.someOtherNestedPrimitive = "changed";
    expect(toBeCloned.someNestedProp.someOtherNestedPrimitive).toEqual("hello");
    expect(cloned.someNestedProp.someOtherNestedPrimitive).toEqual("changed");
  });

  it("should deeply clone an object and modify properties", () => {
    const toBeCloned = {
      someNestedProp: {
        someOtherNestedPrimitive: "hello"
      },
      someNestedArray: [
        { id: 6 },
        {
          nestedPropInArray: [{ id: 8 }]
        },
        {
          nestedPropInArray: [{ id: 10 }]
        }
      ],
      lines: [
        {
          name: "firstObj"
        },
        {
          name: "secondObj"
        }
      ],
      simpleObj: {
        name: "simpleObj"
      },
      simple: "noot"
    };

    const cloned = cloneDeep(
      toBeCloned,
      {
        ".someNestedProp.someOtherNestedPrimitive": (prop: string) => `${prop}AppliedByModifier`,
        ".someNestedArray.nestedPropInArray.id": (prop: number) => prop * 5,
        ".simple": (prop: string) => `${prop}AppliedAgainByModifier`,
        ".lines": (prop: { name: string }) => ({ name: `${prop.name}AppliedByModifier` }),
        ".simpleObj": (prop: { name: string }) => ({ name: `${prop.name}AppliedByModifier` })
      }
    );

    expect(toBeCloned.someNestedProp.someOtherNestedPrimitive).toEqual("hello")
    expect(toBeCloned.someNestedArray[0].id).toEqual(6)
    expect(toBeCloned.someNestedArray[1].nestedPropInArray[0].id).toEqual(8)
    expect(toBeCloned.someNestedArray[2].nestedPropInArray[0].id).toEqual(10)
    expect(toBeCloned.lines[0].name).toEqual("firstObj")
    expect(toBeCloned.lines[1].name).toEqual("secondObj")
    expect(toBeCloned.simpleObj.name).toEqual("simpleObj")

    expect(cloned.someNestedProp.someOtherNestedPrimitive).toEqual("helloAppliedByModifier")
    expect(cloned.someNestedArray[0].id).toEqual(6)
    expect(cloned.someNestedArray[1].nestedPropInArray[0].id).toEqual(40)
    expect(cloned.someNestedArray[2].nestedPropInArray[0].id).toEqual(50)
    expect(cloned.lines[0].name).toEqual("firstObjAppliedByModifier")
    expect(cloned.lines[1].name).toEqual("secondObjAppliedByModifier")
    expect(cloned.simpleObj.name).toEqual("simpleObjAppliedByModifier")
  });
});
