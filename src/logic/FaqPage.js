import { createLogic } from "redux-logic";
import { ApiHelper } from "../helpers/ApiHelper";
import { toast } from "react-toastify";
import { DefaultErrorMessage } from "../config/Constants";
import {
   faqPageActions,
   getFaqPageSucc,
   // showLoader,
   // hideLoader,
} from "./../actions";

let toastId = null;

const getFaqPageLogic = createLogic({
   type: faqPageActions.GET_FAQ_PAGE_REQUEST,
   cancelType: faqPageActions.GET_FAQ_PAGE_FAILED,
   async process({ action }, dispatch, done) {
      // dispatch(showLoader());
      dispatch(getFaqPageSucc({
         isLoading: true
      }));
      let api = new ApiHelper();
      let result = await api.FetchFromServer(
         "/faq",
         "/",
         "GET",
         false,
         undefined,
         undefined
      );
      if (result.isError) {
         if (!toast.isActive(toastId)) {
            toastId = toast.error(result.messages[0] || DefaultErrorMessage);
         }
         // dispatch(hideLoader());
         dispatch(getFaqPageSucc({
            isLoading: false
         }));
         done();
         return;
      } else {
         // dispatch(hideLoader());
         dispatch(getFaqPageSucc({
            faqPageDetails: result.data.data,
            totalFaq:result.data.totalFaq,
            isLoading: false
         }))
         done();
      }
   }
});

export const FaqPageLogic = [
   getFaqPageLogic
];