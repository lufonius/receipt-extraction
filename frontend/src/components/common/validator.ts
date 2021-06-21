export type Validator = (input: any) => string | null;

export const requiredValidator: Validator = (input?: any) => {
  if (input) {
    return null;
  } else {
    return "required-error";
  }
};

export const numberValidator: Validator = (input: string) => {
  if (isNaN(parseFloat(input))) {
    return "number-format-error";
  } else {
    return null;
  }
};
