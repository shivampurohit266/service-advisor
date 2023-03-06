import { handleActions } from "redux-actions";

import { subscriptionActions } from "../actions";

const initialState = {
  isSuccess: false,
  subscriptionPlanData: []
};

export const subscriptionReducer = handleActions(
  {
    [subscriptionActions.ADD_SUBSCRIPTION_REQUEST]: (state, { payload }) => ({
      ...state,
      isSuccess: false
    }),
    [subscriptionActions.ADD_SUBSCRIPTION_SUCCESS]: (state, { payload }) => ({
      ...state,
      isSuccess: true
    }),
    [subscriptionActions.GET_SUBSCRIPTION_PLAN_REQUEST]: (state, { payload }) => ({
      ...state,
      subscriptionPlanData: [],
      isSuccess: false
    }),
    [subscriptionActions.GET_SUBSCRIPTION_PLAN_SUCCESS]: (state, { payload }) => ({
      ...state,
      subscriptionPlanData: payload.subscriptionPlan,
      isSuccess: true
    })
  },
  initialState
);
