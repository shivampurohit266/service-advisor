import { ValidationTypes } from "js-object-validation";

export const AddOrderStatusValidation = {
  orderStatusName: {
    [ValidationTypes.REQUIRED]: true,
    [ValidationTypes.MAXLENGTH]: 50
  }
};
export const AddOrderStatusMessages = {
  orderStatusName: {
    [ValidationTypes.REQUIRED]: "Please enter order status name.",
    [ValidationTypes.MAXLENGTH]:
      "Order status name can only have 50 characters."
  }
};
