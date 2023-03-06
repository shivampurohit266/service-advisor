import { handleActions } from "redux-actions";
import { rateStandardListActions } from "./../actions";

const initialAuthState = {
  standardRateList: [],
  selectedOptions: {}
};

export const rateStandardListReducer = handleActions(
  {
    [rateStandardListActions.GET_RATE_STANDARD_LIST_START]: (
      state,
      action
    ) => ({
      ...state,
      standardRateList: action.payload.standardRateList,
      selectedOptions: action.payload.selectedOptions
    }),
    [rateStandardListActions.GET_RATE_STANDARD_LIST_SUCCESS]: (
      state,
      action
    ) => ({
      ...state,
      standardRateList: action.payload.standardRateList,
      selectedOptions: action.payload.selectedOptions
    }),
    [rateStandardListActions.GET_RATE_STANDARD_LIST_FAILED]: (
      state,
      action
    ) => ({
      ...state,
      standardRateList: action.payload.standardRateList,
      selectedOptions: action.payload.selectedOptions
    }),
    [rateStandardListActions.RATE_ADD_SUCCESS]: (state, action) => ({
      ...state,
      rateData:
        action.payload && action.payload.rateData
          ? action.payload.rateData
          : [],
      selectedOptions: action.payload.selectedOptions,
      isSuccess: true
    }),
    [rateStandardListActions.SET_SELECTED_STANDARD_LIST_REQUEST]: (
      state,
      action
    ) => ({
      ...state,
      rateData:
        action.payload && action.payload.rateData
          ? action.payload.rateData
          : [],
      selectedOptions: action.payload,
      isSuccess: true
    })
  },
  initialAuthState
);
