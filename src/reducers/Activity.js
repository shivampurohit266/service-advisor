import { handleActions } from "redux-actions";
import { activityAction } from "../actions";

const initialState = {
    activity: [],
    isLoading: true,
};

export const activityReducer = handleActions(
    {
        [activityAction.GET_Activity_LIST]: (state, { payload }) => ({
            ...state,
            isLoading: true,
            activity: [],
        }),
        [activityAction.GET_ACTVITY_LIST_SUCCESS]: (state, { payload }) => ({
            ...state,
            isLoading: false,
            activity: payload.activity,
        }),
        [activityAction.ADD_ACTIVITY]: (state, action) => ({
            ...state,
            isLoading: true
        }),
        [activityAction.ADD_ACTIVITY_SUCCESS]: (state, action) => ({
            ...state,
            isLoading: false
        }),
    },
    initialState
);
