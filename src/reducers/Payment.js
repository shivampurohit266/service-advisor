import { handleActions } from "redux-actions";
import { PaymentActions } from "../actions";

const initialState = {
   isSuccess: false,
   paymentData: [],
   isLoading: true,
}

export const paymentReducer = handleActions(
   {
      [PaymentActions.GET_PAYMENT_REQUEST]: (state, action) => ({
         paymentData: [],
         isSuccess: true,
         isLoading: false
      }),
      [PaymentActions.GET_PAYMENT_SUCCESS]: (state, action) => ({
         paymentData: action.payload.payment,
         isSuccess: true,
         isLoading: false
      }),
   },
   initialState
);