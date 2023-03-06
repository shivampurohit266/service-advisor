import { createLogic } from "redux-logic";
import { ApiHelper } from "../helpers/ApiHelper";
import Swal from "sweetalert2";
import {
  addPaymentSuccess,
  PaymentActions,
  showLoader,
  hideLoader,
  modelOpenRequest,
  addNewActivity,
  getOrderDetailsRequest
} from "./../actions";
import { logger } from "../helpers/Logger";
import { toast } from "react-toastify";
import { DefaultErrorMessage } from "../config/Constants";
let toastId = null;

const addPaymentLogic = createLogic({
  type: PaymentActions.ADD_PAYMENT_REQUEST,
  async process({ action }, dispatch, done) {
    const { payload } = action;
    dispatch(showLoader())
    logger(payload);
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/payment",
      "/addPayment",
      "POST",
      true,
      undefined,
      action.payload
    );
    logger(result);
    dispatch(hideLoader());
    if (result.isError) {
      if (!toast.isActive(toastId)) {
        toastId = toast.error(
           result.messages[0] || DefaultErrorMessage
        );
     }
      done();
      return;
    } else {
      // toast.success(result.messages[0]);
      Swal.fire({
        position: 'center',
        type: 'success',
        title: 'Your payment has been saved',
        showConfirmButton: false,
        timer: 1800
      })
      dispatch(
        addPaymentSuccess()
      );
      const lastPayment = action.payload.payedAmount[action.payload.payedAmount.length - 1].amount
      const data = {
        name: `added ${action.payload.paymentType} payment of ${lastPayment}`,
        type: "ADD_PAYMENT",
        orderId: action.payload.orderId
      }
      dispatch(addNewActivity(data))
      dispatch(
        modelOpenRequest({
          modelDetails: {
            paymentModalOpen: false
          }
        })
      );
      dispatch(getOrderDetailsRequest({ _id: action.payload.orderId }))
      done();
    }
  }
})

export const PaymentLogic = [
  addPaymentLogic
]