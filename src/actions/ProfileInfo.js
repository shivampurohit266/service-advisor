import { createAction } from "redux-actions";

export const profileInfoActions = {
  PROFILE_INFO_REQUEST: "ProfileInfo Requested!",
  PROFILE_INFO_SUCCESS: "ProfileInfo successfully!",
  PROFILE_INFO_FAILED: "ProfileInfo failed!",
  PROFILE_INFO_START: "ProfileInfo Started!",
  UPDATE_COMPANY_LOGO: "Request company logo update!",
  UPDATE_COMPANY_LOGO_SUCCESS: "Request company logo update success!",
  UPDATE_COMPANY_DETAILS: "Request company details update!",
  UPDATE_PASSWORD_REQUEST: "Passwrod update request",
  UPDATE_PASSWORD_SUCCESS: "Passwrod update success",
  UPDATE_PASSWORD_FAILED: "Passwrod update failed",
  PROFILE_SETTING_UPDATE_REQUEST: "Profile setting update request",
  PROFILE_SETTING_UPDATE_SUCCESS: "Profile setting update success",
  PROFILE_SETTING_UPDATE_FAILED: "Profile setting update failed",
};

export const profileInfoRequest = createAction(
  profileInfoActions.PROFILE_INFO_REQUEST
);
export const profileInfoStarted = createAction(
  profileInfoActions.PROFILE_INFO_START
);
export const profileInfoSuccess = createAction(
  profileInfoActions.PROFILE_INFO_SUCCESS
);
export const profileInfoFailed = createAction(
  profileInfoActions.PROFILE_INFO_FAILED
);
export const updateCompanyLogo = createAction(
  profileInfoActions.UPDATE_COMPANY_LOGO
);
export const updateCompanyLogoSuccess = createAction(
  profileInfoActions.UPDATE_COMPANY_LOGO_SUCCESS
);
export const updateCompanyDetails = createAction(
  profileInfoActions.UPDATE_COMPANY_DETAILS
);
export const updatePasswordRequest = createAction(
  profileInfoActions.UPDATE_PASSWORD_REQUEST
);
export const updatePasswordSuccess = createAction(
  profileInfoActions.UPDATE_PASSWORD_SUCCESS
);
export const updatePasswordFailed = createAction(
  profileInfoActions.UPDATE_PASSWORD_FAILED
);
export const profileSettingUpdateRequest = createAction(
  profileInfoActions.PROFILE_SETTING_UPDATE_REQUEST
);
export const profileSettingUpdateSuccess = createAction(
  profileInfoActions.PROFILE_SETTING_UPDATE_SUCCESS
);
export const profileSettingUpdateFailed = createAction(
  profileInfoActions.PROFILE_SETTING_UPDATE_FAILED
);