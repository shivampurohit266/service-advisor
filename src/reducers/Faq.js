import { handleActions } from "redux-actions";
import { faqPageActions } from "./../actions";

const initialState = {
   faqPageDetails: [],
   totalFaq:0,
   isLoading: true,
};

export const faqPageReducer = handleActions(
   {
      [faqPageActions.GET_FAQ_PAGE_SUCCESS]: (state, { payload }) => ({
         ...state,
         ...payload
      }),
   },
   initialState
);