import { createAction } from "redux-actions";

export const SummaryActions = {
  VERIFY_LINK_REQUEST: "verify Requested!",
  VERIFY_LINK_SUCCESS: "Verify Success!",
  GET_ORDER_SUMMARY: "get order summary data!",
};

export const verifyLinkRequest = createAction(SummaryActions.VERIFY_LINK_REQUEST);
export const verifyLinkSuccess = createAction(SummaryActions.VERIFY_LINK_SUCCESS);

export const getOrderSummary = createAction(SummaryActions.GET_ORDER_SUMMARY);

