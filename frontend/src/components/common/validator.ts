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

export const emailValidator: Validator = (input: string) => {
  if (!input) {
    return null;
  }

  var email_regex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

  return email_regex.test(input) ? null : "email-format-error";
}
