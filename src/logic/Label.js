import { toast } from "react-toastify";
import { createLogic } from "redux-logic";
import { ApiHelper } from "../helpers/ApiHelper";
import { logger } from "../helpers/Logger";
import {
   showLoader,
   hideLoader,
   labelAction,
   addLabelSuccess,
   getLabelListSuccess,
   getLabelList,
} from "./../actions";

let toastId = null ;
/* add new label */
const addLabelLogic = createLogic({
   type: labelAction.ADD_LABEL,
   async process({ action }, dispatch, done) {
      dispatch(showLoader());
      logger(action.payload);
      let api = new ApiHelper();
      let result = await api.FetchFromServer(
         "/label",
         "/addNewLabel",
         "POST",
         true,
         undefined,
         action.payload
      );
      if (result.isError) {
         if (!toast.isActive(toastId)) {
            toastId = toast.error(
               result.messages[0]
            );
         }
         dispatch(getLabelList());
         dispatch(hideLoader());
         done();
         return;
      } else {
         if (!toast.isActive(toastId)) {
            toastId = toast.success(
               result.messages[0]
            );
         }
         dispatch(addLabelSuccess());
         dispatch(getLabelList());
         dispatch(hideLoader());
         done();
      }
   }
});

/* get saved label */
const getLabelLogic = createLogic({
   type: labelAction.GET_LABEL_LIST,
   async process({ action }, dispatch, done) {
      dispatch(
         getLabelListSuccess({
            isLoading: true,
            label: []
         })
      );
      let api = new ApiHelper();
      let result = await api.FetchFromServer(
         "/label",
         "/getLabel",
         "GET",
         true,
         {
            "isSavedLabel": true
         }
      );
      if (result.isError) {
         dispatch(
            getLabelListSuccess({
               isLoading: false,
               label: []
            })
         );
         done();
         return;
      } else {
         dispatch(hideLoader());
         dispatch(
            getLabelListSuccess({
               isLoading: false,
               label: result.data.data,
            })
         );
         done();
      }
   }
});

/* delete saved label */
const deleteLabelLogic = createLogic({
   type: labelAction.DELETE_LABEL,
   async process({ action }, dispatch, done) {
      dispatch(showLoader());
      logger(action.payload);
      let api = new ApiHelper();
      let result = await api.FetchFromServer(
         "/label",
         "/updateLabel",
         "PUT",
         true,
         undefined,
         action.payload
      );
      if (result.isError) {
         if (!toast.isActive(toastId)) {
            toastId = toast.error(
               result.messages[0]
            );
         }
         dispatch(getLabelList());
         dispatch(hideLoader());
         done();
         return;
      } else {
         if (!toast.isActive(toastId)) {
            toastId = toast.success(
               result.messages[0]
            );
         }
         dispatch(getLabelList());
         dispatch(hideLoader());
         done();
      }
   }
});

export const LabelLogic = [
   addLabelLogic,
   getLabelLogic,
   deleteLabelLogic
];