import { createAction } from "redux-actions";

export const subscriptionActions = {
  ADD_SUBSCRIPTION_REQUEST: "Add subscription request",
  ADD_SUBSCRIPTION_SUCCESS: "Add subscription success",
  GET_SUBSCRIPTION_PLAN_REQUEST: "Get subscription plan list request",
  GET_SUBSCRIPTION_PLAN_SUCCESS: "Get subscription plan list success",
};

export const addSubscriptionRequest = createAction(subscriptionActions.ADD_SUBSCRIPTION_REQUEST);
export const addSubscriptionSuccess = createAction(subscriptionActions.ADD_SUBSCRIPTION_SUCCESS);
export const getSubscriptionPlanRequest = createAction(subscriptionActions.GET_SUBSCRIPTION_PLAN_REQUEST);
export const getSubscriptionPlanSuccess = createAction(subscriptionActions.GET_SUBSCRIPTION_PLAN_SUCCESS);
