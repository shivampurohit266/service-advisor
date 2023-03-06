import { ValidationTypes } from 'js-object-validation';

export const VehicleValidations = {
  year: {
    [ValidationTypes.REQUIRED]: true,
    [ValidationTypes.NUMERIC]: true,
  },
  make: {
    [ValidationTypes.REQUIRED]: true,
  },
  modal: {
    [ValidationTypes.REQUIRED]: true,
  },
  miles: {
    [ValidationTypes.NUMERIC]: true,
  },
  type: {
    [ValidationTypes.REQUIRED]: true,
  },
  subModal: {
    [ValidationTypes.REQUIRED]: true,
  },
  engineSize: {
    [ValidationTypes.REQUIRED]: true,
  },
  productionDate: {
    [ValidationTypes.REQUIRED]: true,
  },
  transmission: {
    [ValidationTypes.REQUIRED]: true,
  },
  drivetrain: {
    [ValidationTypes.REQUIRED]: true,
  },
  notes: {
    [ValidationTypes.REQUIRED]: true,
  },
  licensePlate: {
    [ValidationTypes.REQUIRED]: true,
  }
};

export const VehicleValidationMessage = {
  year: {
    [ValidationTypes.REQUIRED]: 'Please enter year.',
    [ValidationTypes.NUMERIC]: 'Only numbers are allowed.',
  },
  make: {
    [ValidationTypes.REQUIRED]: 'Please enter make.',
  },
  modal: {
    [ValidationTypes.REQUIRED]: 'Please enter modal.',
  },
  miles: {
    [ValidationTypes.NUMERIC]: "Please enter only numbers",
  },
  type: {
    [ValidationTypes.REQUIRED]: 'Please select type',
  },
  subModal: {
    [ValidationTypes.REQUIRED]: 'Sub-Modal is required',
  },
  engineSize: {
    [ValidationTypes.REQUIRED]: 'Engine size is required',
  },
  productionDate: {
    [ValidationTypes.REQUIRED]: 'Production date is required',
  },
  transmission: {
    [ValidationTypes.REQUIRED]: 'Transmission is required',
  },
  drivetrain: {
    [ValidationTypes.REQUIRED]: 'Drivetrain is required',
  },
  notes: {
    [ValidationTypes.REQUIRED]: 'Notes is required',
  },
  licensePlate: {
    [ValidationTypes.REQUIRED]: "Please enter license plate data."
  }
};
