import { handleActions } from "redux-actions";
import { tiersActions } from "../actions";

const initialState = {
   tires: [],
   isLoading: true,
   totalTires: 100,
   tireData: {
      isSuccess: false,
      isEditSuccess: false,
      data: {}
   }
};

export const tiresReducer = handleActions(
   {
      [tiersActions.GET_TIER_LIST_SUCCESS]: (state, { payload }) => ({
         ...state,
         ...payload,
      }),
      [tiersActions.ADD_TIER]: (state, action) => ({
         ...state,
         tireData: {
            ...state.tireData,
            isSuccess: false
         }
      }),
      [tiersActions.ADD_TIER_SUCCESS]: (state, action) => ({
         ...state,
         tireData: {
            isSuccess: true,
            data: {}
         }
      }),
      [tiersActions.EDIT_TIER]: (state, action) => ({
         ...state,
         tireData: {
            ...state.tireData,
            isEditSuccess: false
         }
      }),
      [tiersActions.EDIT_TIER_SUCCESS]: (state, action) => ({
         ...state,
         tireData: {
            ...state.tireData,
            isEditSuccess: true
         }
      })
   },
   initialState
);
