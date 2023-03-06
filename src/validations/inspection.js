import { ValidationTypes } from 'js-object-validation';

export const inspectValidations = {
  subject: {
    [ValidationTypes.REQUIRED]: true
  },
  email: {
    // [ValidationTypes.REQUIRED]: true,
    [ValidationTypes.EMAIL]: true,
  },
};

export const inspectValidationMessage = {
  subject: {
    [ValidationTypes.REQUIRED]: 'Please enter subject for template.',
  },
  email: {
    // [ValidationTypes.REQUIRED]: 'Please enter email address',
    [ValidationTypes.EMAIL]: "Enter a valid email",
  },
};
