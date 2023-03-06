import { ValidationTypes } from "js-object-validation";

export const CreateCustomerValidations = {
  firstName: {
    [ValidationTypes.REQUIRED]: true,
    // [ValidationTypes.ALPHA]: true,
  },
  email:{
    [ValidationTypes.EMAIL]: true
  }
};

export const CreateCustomerValidMessaages = {
  firstName: {
    [ValidationTypes.REQUIRED]: "Please enter first name.",
    // [ValidationTypes.ALPHA]: "Only alphabets are allowed "
  },
  email:{
    [ValidationTypes.EMAIL]: "Please enter valid email address."
  }
};


