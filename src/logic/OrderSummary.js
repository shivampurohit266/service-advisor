//import { toast } from "react-toastify";
import { createLogic } from "redux-logic";
import { ApiHelper } from "../helpers/ApiHelper";
import {
  SummaryActions,
  getOrderSummary,
  showLoader,
  hideLoader,
  redirectTo,
} from "./../actions";

const verifyLinkLogic = createLogic({
  type: SummaryActions.VERIFY_LINK_REQUEST,
  async process({ action }, dispatch, done) {
    localStorage.removeItem("userId");
    dispatch(showLoader());
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/message",
      "/verifyLink",
      "POST",
      false,
      undefined,
      action.payload
    );
    if (result.isError) {
      dispatch(hideLoader());
      dispatch(
        redirectTo({
          path: "/404"
        })
      );
      done();
      return;
    } else {
      dispatch(hideLoader());
      dispatch(
        getOrderSummary({
          order: result.data.data,
          user: result.data.companyData,
          message: result.data.messageData
        })
      );

      done();
    }
  }
});

export const OrderSummaryLogic = [
  verifyLinkLogic,
];
