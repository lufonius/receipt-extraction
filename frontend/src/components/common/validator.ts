export type Validator = (input: any) => string | null;

export const requiredValidator: Validator = (input?: any) => {
  if (input) {
    return null;
  } else {
    return "required-error";
  }
};

export const numberValidator: Validator = (input: string) => {
  if (!input) {
    return null;
  }

  const regexp = /^\d+(\.\d{0,2})?$/;

  return regexp.test(input) ? null : "number-format-error";
};

export const dateValidator: Validator = (input: string) => {
  if (!input) {
    return null;
  }

  var date_regex = /^\s*(3[01]|[12][0-9]|0?[1-9])\.(1[012]|0?[1-9])\.((?:19|20)\d{2})\s*$/;
  return date_regex.test(input) ? null : "date-format-error";
};
