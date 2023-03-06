import { ValidationTypes } from "js-object-validation";

export const SingupValidations = {
  firstName: {
    [ValidationTypes.REQUIRED]: true,
    [ValidationTypes.MAXLENGTH]: 100
  },
  lastName: {
    [ValidationTypes.REQUIRED]: true,
    [ValidationTypes.MAXLENGTH]: 100
  },
  email: {
    [ValidationTypes.REQUIRED]: true,
    [ValidationTypes.EMAIL]: true,
    [ValidationTypes.MAXLENGTH]: 100
  },
  password: {
    [ValidationTypes.REQUIRED]: true,
    [ValidationTypes.MINLENGTH]: 6,
    [ValidationTypes.MAXLENGTH]: 20,
  },
  confirmPassword: {
    [ValidationTypes.REQUIRED]: true,
    [ValidationTypes.EQUAL]: "password"
  },
  companyName: {
    [ValidationTypes.REQUIRED]: true
  },
  workspace: {
    [ValidationTypes.REQUIRED]: true
  },
  companyWebsite: {
    [ValidationTypes.REQUIRED]: false
  }
};

export const SingupValidationsMessaages = {
  firstName: {
    [ValidationTypes.REQUIRED]: "Please enter first name.",
    [ValidationTypes.MAXLENGTH]:
      "First name cannot have more that 100 characters."
  },
  lastName: {
    [ValidationTypes.REQUIRED]: "Please enter last name.",
    [ValidationTypes.MAXLENGTH]:
      "Last name cannot have more that 100 characters."
  },
  email: {
    [ValidationTypes.REQUIRED]: "Please enter email.",
    [ValidationTypes.EMAIL]: "Please enter a valid email.",
    [ValidationTypes.MAXLENGTH]: "Email cannot have more that 100 characters."
  },
  password: {
    [ValidationTypes.REQUIRED]: "Please enter password.",
    [ValidationTypes.MINLENGTH]: "Please enter atleast 6 characters.",
    [ValidationTypes.MAXLENGTH]: "Password cannot have more that 20 characters.",
  },
  confirmPassword: {
    [ValidationTypes.REQUIRED]: "Please enter confirm password.",
    [ValidationTypes.EQUAL]: "Password and confirm password didn't match."
  },
  companyName: {
    [ValidationTypes.REQUIRED]: "Please enter company name."
  },
  workspace: {
    [ValidationTypes.REQUIRED]: "Please enter your workspace.",
    [ValidationTypes.ALPHA_NUMERIC]:
      "Workspace should be alpha numeric and all lowercase."
  },
  companyWebsite: {
    [ValidationTypes.REQUIRED]: false
  }
};
