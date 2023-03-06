import { createAction } from "redux-actions";

export const activityAction = {
    GET_Activity_LIST: "Activity list Requested!",
    GET_ACTVITY_LIST_SUCCESS: "Activity list success!",
    ADD_ACTIVITY: "Add new Activity Request!",
    ADD_ACTIVITY_SUCCESS: "Add new Activity Success!",
};

export const getActivityList = createAction(activityAction.GET_Activity_LIST);
export const getActivityListSuccess = createAction(
    activityAction.GET_ACTVITY_LIST_SUCCESS
);
export const addNewActivity = createAction(activityAction.ADD_ACTIVITY);
export const addActivitySuccess = createAction(activityAction.ADD_ACTIVITY_SUCCESS);
