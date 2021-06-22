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

  return isNaN(parseFloat(input)) ? "number-format-error" : null;
};

export const dateValidator: Validator = (input: string) => {
  if (!input) {
    return null;
  }

  // usa uses mm-dd-yyyy
  var date_regex = /^\d{2}-\d{2}-\d{4}$/ ;
  return date_regex.test(input) ? null : "date-format-error";
};
