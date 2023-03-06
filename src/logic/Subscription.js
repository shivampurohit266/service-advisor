import { createLogic } from "redux-logic";
import { ApiHelper } from "../helpers/ApiHelper";
import {
   subscriptionActions,
   showLoader,
   getSubscriptionPlanSuccess,
   hideLoader,
   modelOpenRequest,
   profileInfoRequest,
   redirectTo
} from "../actions";
import { toast } from "react-toastify";
import { DefaultErrorMessage } from "../config/Constants";

let toastId = null;
/**
 *
 */
const addSubscriptionLogic = createLogic({
   type: subscriptionActions.ADD_SUBSCRIPTION_REQUEST,
   async process({ action }, dispatch, done) {
      dispatch(showLoader());
      const result = await new ApiHelper().FetchFromServer(
         "/membership-plan",
         "/subscribe",
         "POST",
         true,
         undefined,
         action.payload
      );
      if (result.isError) {
         if (!toast.isActive(toastId)) {
            toastId = toast.error(
               result.messages[0] || DefaultErrorMessage
            );
         }
         dispatch(hideLoader());
         done();
         return;
      } else {
         if (!toast.isActive(toastId)) {
            toastId = toast.success(
               result.messages[0]
            );
         }
         dispatch(
           modelOpenRequest({
             modelDetails: {
               openSubscriptionModel: false,
               openSubPayementModel: false,
               openSubUpgradeModel: false,
               openSubscriptionUpdateModel:false
             }
           })
         );
         dispatch(profileInfoRequest())
         dispatch(redirectTo({path:"/"}))
         dispatch(hideLoader());
         done();
      }
   }
});
/**
 *
 */
const getSubscriptionPlanLogic = createLogic({
   type: subscriptionActions.GET_SUBSCRIPTION_PLAN_REQUEST,
   async process({ action }, dispatch, done) {
      const result = await new ApiHelper().FetchFromServer(
         "/membership-plan",
         "/list",
         "GET",
         true,
         undefined,
         action.payload
      );
      if (result.isError) {
         if (!toast.isActive(toastId)) {
            toastId = toast.error(
               result.messages[0] || DefaultErrorMessage
            );
         }
         done();
         return;
      } else {
         dispatch(
            getSubscriptionPlanSuccess({
               subscriptionPlan: result.data.data
            })
         );
         done();
      }
   }
});
/*
/*  
*/
export const SubscriptionLogic = [
   addSubscriptionLogic,
   getSubscriptionPlanLogic
];
