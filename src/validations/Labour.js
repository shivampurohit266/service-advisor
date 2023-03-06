import { ValidationTypes } from "js-object-validation";
export const CreateLabourValidations = {
    discription: {
        [ValidationTypes.REQUIRED]: true,
    },
    hours: {
        [ValidationTypes.NUMERIC]: true,
    },

};
export const CreateLabourValidMessaages = {
    discription: {
        [ValidationTypes.REQUIRED]: "Please enter Labor Description.",
    },
    hours: {
        [ValidationTypes.NUMERIC]: "Please enter numeric value.",
    },
};
