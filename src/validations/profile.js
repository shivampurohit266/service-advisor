import { ValidationTypes } from "js-object-validation";

export const ProfileValidations = {
         firstName: {
           [ValidationTypes.REQUIRED]: true,
           [ValidationTypes.MAXLENGTH]: 100
         },
         lastName: {
           [ValidationTypes.REQUIRED]: true,
           [ValidationTypes.MAXLENGTH]: 100
         },
         phoneNumber: {
           [ValidationTypes.NUMERIC]: true,
           [ValidationTypes.MINLENGTH]: 13
         },
         phone: {
           [ValidationTypes.MINLENGTH]: 13
         },
         companyName: {
           [ValidationTypes.REQUIRED]: true
         },
         vatNumber: {
           [ValidationTypes.NUMERIC]: true
         },
         oldPassword: {
           [ValidationTypes.REQUIRED]: true,
           [ValidationTypes.MAXLENGTH]: 100
         },
         newPassword: {
           [ValidationTypes.REQUIRED]: true,
           [ValidationTypes.MINLENGTH]: true,
           [ValidationTypes.MAXLENGTH]: 20
         },
         confirmPassword: {
           [ValidationTypes.REQUIRED]: true,
           [ValidationTypes.EQUAL]: "newPassword"
         }
       };

export const ProfileValidationsMessaages = {
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
         phoneNumber: {
           [ValidationTypes.NUMERIC]: "Only numbers are allowed.",
           [ValidationTypes.MINLENGTH]: "Please enter 10 numbers"
         },
         phone: {
           [ValidationTypes.MINLENGTH]: "Please enter 10 numbers"
         },
         companyName: {
           [ValidationTypes.REQUIRED]: "Please enter comapny name."
         },
         vatNumber: {
           [ValidationTypes.NUMERIC]: "Only numbers are allowed."
         },
         oldPassword: {
           [ValidationTypes.REQUIRED]: "Please enter current password"
         },
         newPassword: {
           [ValidationTypes.REQUIRED]: "Please enter password.",
           [ValidationTypes.MINLENGTH]:
             "Please enter atleast 6 characters.",
           [ValidationTypes.MAXLENGTH]:
             "Password cannot have more that 20 characters"
         },
         confirmPassword: {
           [ValidationTypes.REQUIRED]: "Please enter confirm password.",
           [ValidationTypes.EQUAL]:
             "Password and confirm password didn't match."
         }
       };