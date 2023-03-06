import { createAction } from "redux-actions";

export const siteSettingActions = {
   GET_SITE_SETTING_REQUEST: "Get site-setting req!",
   GET_SITE_SETTING_FAILED: "Get site-setting failed!",
   GET_SITE_SETTING_SUCCESS: "Get site-setting success!",
}

export const getSiteSettingReq = createAction(
    siteSettingActions.GET_SITE_SETTING_REQUEST
);
export const getSiteSettingFail = createAction(
    siteSettingActions.GET_SITE_SETTING_FAILED
);
export const getSiteSettingSucc = createAction(
    siteSettingActions.GET_SITE_SETTING_SUCCESS
);
