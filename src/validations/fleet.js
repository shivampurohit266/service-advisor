import { ValidationTypes } from "js-object-validation";

export const CreateFleetValidations = {
  companyName: {
    [ValidationTypes.REQUIRED]: true,
  },
  email: {
    [ValidationTypes.EMAIL]: true
  }
};

export const CreateFleetValidMessaages = {
  companyName: {
    [ValidationTypes.REQUIRED]: "Please enter company Name.",
  },
  email: {
    [ValidationTypes.EMAIL]: "Enter valid email address."
  }
};


