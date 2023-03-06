import { ValidationTypes } from "js-object-validation";

export const CreateTierValidations = {
    brandName: {
        [ValidationTypes.REQUIRED]: true,
    },
    modalName: {
        [ValidationTypes.REQUIRED]: true,
    }
};

export const CreateTierValidMessaages = {
    brandName: {
        [ValidationTypes.REQUIRED]: "Please enter brand name.",
    },
    modalName: {
        [ValidationTypes.REQUIRED]: "Please enter model name.",
    }
};


