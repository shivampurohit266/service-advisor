import { handleActions } from "redux-actions";
import { siteSettingActions } from "./../actions";

const initialState = {
   settingDetails: {},
   isLoading: true,

};

export const siteSettingDetailsReducer = handleActions(
   {
      [siteSettingActions.GET_SITE_SETTING_SUCCESS]: (state, { payload }) => ({
         ...state,
         ...payload
      })
   },
   initialState
);