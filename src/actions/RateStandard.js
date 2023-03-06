import { createAction } from "redux-actions";

export const rateStandardListActions = {
  GET_RATE_STANDARD_LIST_REQUEST: "Rate Standard list Requested!",
  GET_RATE_STANDARD_LIST_SUCCESS: "Rate Standard list success!",
  GET_RATE_STANDARD_LIST_FAILED: 'Rate Standard list failed!',
  GET_RATE_STANDARD_LIST_START: 'Rate Standard list Started!',
  SET_SELECTED_STANDARD_LIST_REQUEST: 'SET Standard list SELECTED Started!',
  SET_SELECTED_STANDARD_LIST_SUCCESS: 'SET Standard list success!',
  RATE_ADD_REQUEST: 'RateAdd Requested!',
  RATE_ADD_SUCCESS: 'RateAdd successfully!',
  RATE_ADD_FAILED: 'RateAdd failed!',
  RATE_ADD_START: 'RateAdd Started!'
};
export const rateAddRequest = createAction(rateStandardListActions.RATE_ADD_REQUEST);
export const rateAddStarted = createAction(rateStandardListActions.RATE_ADD_START);
export const rateAddSuccess = createAction(rateStandardListActions.RATE_ADD_SUCCESS);
export const rateAddFailed = createAction(rateStandardListActions.RATE_ADD_FAILED);
export const getRateStandardListRequest = createAction(
  rateStandardListActions.GET_RATE_STANDARD_LIST_REQUEST
);
export const getRateStandardListSuccess = createAction(
  rateStandardListActions.GET_RATE_STANDARD_LIST_SUCCESS
);
export const getRateStandardListFail = createAction(
  rateStandardListActions.GET_RATE_STANDARD_LIST_FAILED
);
export const getRateStandardListStart = createAction(
  rateStandardListActions.GET_RATE_STANDARD_LIST_START
);

export const setRateStandardListStart = createAction(
  rateStandardListActions.SET_SELECTED_STANDARD_LIST_REQUEST
);
export const setRateStandardListSuccess = createAction(
  rateStandardListActions.SET_SELECTED_STANDARD_LIST_SUCCESS
);