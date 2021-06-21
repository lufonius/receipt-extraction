import {numberValidator, requiredValidator} from "./validator";

describe("validator", () => {
  it("required validator should return error if no value set", () => {
    expect(requiredValidator(null)).toEqual("required-error");
    expect(requiredValidator("")).toEqual("required-error");
    expect(requiredValidator(undefined)).toEqual("required-error");
    expect(requiredValidator(0)).toEqual("required-error");
  });

  it("required validator should return null if  value set", () => {
    expect(requiredValidator("hello world")).toEqual(null);
  });

  it("number validator should return null if value is a valid number", () => {
    expect(numberValidator("1")).toEqual(null);
    expect(numberValidator("1.23")).toEqual(null);
    expect(numberValidator("1,23")).toEqual(null);
  });

  it("number validator should return error if value is not a valid number", () => {
    expect(numberValidator("hey babo")).toEqual("number-format-error");
  });
});
