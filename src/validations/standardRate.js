import { ValidationTypes } from "js-object-validation";

export const CreateRateValidations = {
  name: {
    [ValidationTypes.REQUIRED]: true
  },
  hourRate: {
    [ValidationTypes.REQUIRED]: true,
    [ValidationTypes.NUMERIC]: true
  }
};
export const CreateRateValidMessaages = {
  name: {
    [ValidationTypes.REQUIRED]: "Please enter name."
  },
  hourRate: {
    [ValidationTypes.REQUIRED]: "Please enter hour rate.",
    [ValidationTypes.NUMERIC]: "Only numbers are allowed."
  }
};
