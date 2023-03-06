import { handleActions } from "redux-actions";
import { homePageActions } from "./../actions";

const initialState = {
   homePageDetails: {},
   isLoading: true,
};

export const homePageDetailsReducer = handleActions(
   {
      [homePageActions.GET_HOME_PAGE_SUCCESS]: (state, { payload }) => ({
         ...state,
         ...payload
      }),
   },
   initialState
);