import { ValidationTypes } from "js-object-validation";

export const AddAppointmentValidations = {
  selectedColor: {
    [ValidationTypes.REQUIRED]: true
  },
  appointmentTitle: {
    [ValidationTypes.REQUIRED]: true
  },
  email: {
    [ValidationTypes.EMAIL]: true
  },
  selectedCustomer: {
    [ValidationTypes.REQUIRED]: true
  }
};

export const AddAppointmentMessages = {
  selectedColor: {
    [ValidationTypes.REQUIRED]: "Please choose selected color."
  },
  appointmentTitle: {
    [ValidationTypes.REQUIRED]: "Please enter appointment title."
  },
  email: {
    [ValidationTypes.EMAIL]: "Email should be valid."
  },
  selectedCustomer: {
    [ValidationTypes.REQUIRED]: "Please choose customer."
  }
};
