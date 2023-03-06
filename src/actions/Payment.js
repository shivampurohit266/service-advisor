import { createAction } from "redux-actions";

export const PaymentActions = {
   ADD_PAYMENT_REQUEST: "Add payment Requested!",
   ADD_PAYMENT_SUCCESS: "Add payment Success!",
   GET_PAYMENT_REQUEST: "Get payment list request",
   GET_PAYMENT_SUCCESS: "Get payment list success!"
};

export const addPaymentRequest = createAction(PaymentActions.ADD_PAYMENT_REQUEST);
export const addPaymentSuccess = createAction(PaymentActions.ADD_PAYMENT_SUCCESS);
export const getPaymentRequest = createAction(PaymentActions.GET_PAYMENT_REQUEST);
export const getPaymentSuccess = createAction(PaymentActions.GET_PAYMENT_SUCCESS);

