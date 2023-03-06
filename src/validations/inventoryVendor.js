import { ValidationTypes } from 'js-object-validation';

export const VendorValidations = {
  name: {
    [ValidationTypes.REQUIRED]: true
  },
  accountNumber: {
    [ValidationTypes.REQUIRED]: true,
    [ValidationTypes.NUMERIC]: true,
  },
  phoneNumber: {
    [ValidationTypes.NUMERIC]: true,
  },
  email: {
    [ValidationTypes.EMAIL]: true,
  },
 };

export const VendorValidationMessage = {
  name: {
    [ValidationTypes.REQUIRED]: 'Please enter name.',
  },
  accountNumber: {
    [ValidationTypes.REQUIRED]: 'Please enter account number.',
    [ValidationTypes.NUMERIC]: 'Only numbers are allowed.',
  },
  phoneNumber: {
    [ValidationTypes.NUMERIC]: 'Only numbers are allowed.',
  },
  email: {
    [ValidationTypes.EMAIL]: "Please enter a valid email",
  },
 };
