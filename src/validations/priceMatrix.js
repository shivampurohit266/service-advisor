import { ValidationTypes } from "js-object-validation";

export const CreatePriceMatrixValidations = {
    matrixName: {
        [ValidationTypes.REQUIRED]: true,
    }
};

export const CreatePriceMatrixValidMessaages = {
    matrixName: {
        [ValidationTypes.REQUIRED]: "Please enter matrix name.",
    }
};


