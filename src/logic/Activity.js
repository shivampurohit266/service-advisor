import { toast } from "react-toastify";
import { createLogic } from "redux-logic";
import { ApiHelper } from "../helpers/ApiHelper";
import { logger } from "../helpers/Logger";
import {
   activityAction,
   addActivitySuccess,
   getActivityListSuccess,
   getActivityList,
} from "./../actions";
 let toastId = null ;
/* add new Activity */
const addActivityLogic = createLogic({
   type: activityAction.ADD_ACTIVITY,
   async process({ action }, dispatch, done) {
      logger(action.payload);
      let api = new ApiHelper();
      let result = await api.FetchFromServer(
         "/activity",
         "/addActivity",
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
         dispatch(getActivityList());
         done();
         return;
      } else {
         dispatch(addActivitySuccess());
         dispatch(getActivityList({
            orderId: action.payload.orderId
         }));
         done();
      }
   }
});

/* get saved label */
const getActivityLogic = createLogic({
   type: activityAction.GET_Activity_LIST,
   async process({ action }, dispatch, done) {
      dispatch(
         getActivityListSuccess({
            isLoading: true,
            activity: []
         })
      );
      let api = new ApiHelper();
      let result = await api.FetchFromServer(
         "/activity",
         "/getActivity",
         "GET",
         true,
         action.payload
      );
      if (result.isError) {
         dispatch(
            getActivityListSuccess({
               isLoading: false,
               label: []
            })
         );
         done();
         return;
      } else {
         dispatch(
            getActivityListSuccess({
               isLoading: false,
               activity: result.data.data,
            })
         );
         done();
      }
   }
});
export const ActivityLogic = [
   addActivityLogic,
   getActivityLogic
];