import { handleActions } from "redux-actions";
import { profileInfoActions } from "./../actions";

const initialAuthState = {
  profileInfo: {},
  companyInfo: {},
  isLoading: true,
  companyLogoUpdated: true,
  isLogoLoading: false
};

export const profileInfoReducer = handleActions(
  {
    [profileInfoActions.PROFILE_INFO_START]: (state, action) => ({
      ...state,
      profileInfo: action.payload.profileInfo,
      isLoading: action.payload.isLoading
    }),
    [profileInfoActions.PROFILE_INFO_SUCCESS]: (state, action) => ({
      ...state,
      profileInfo: action.payload.profileInfo,
      isLoading: action.payload.isLoading,
      companyInfo: action.payload.companyInfo
    }),
    [profileInfoActions.PROFILE_INFO_FAILED]: (state, action) => ({
      ...state,
      profileInfo: action.payload.profileInfo,
      isLoading: action.payload.isLoading
    }),
    [profileInfoActions.UPDATE_COMPANY_LOGO]: (state, action) => ({
      ...state,
      companyLogoUpdated: false,
      isLogoLoading: true
    }),
    [profileInfoActions.UPDATE_COMPANY_LOGO_SUCCESS]: (state, action) => ({
      ...state,
      profileInfo: {
        ...state.profileInfo,
        shopLogo: action.payload.shopLogo
      },
      companyLogoUpdated: true,
      isLogoLoading: false
    }),
    [profileInfoActions.UPDATE_PASSWORD_REQUEST]: (state, action) => ({
      ...state,
      isSuccess: false
    }),
    [profileInfoActions.UPDATE_PASSWORD_SUCCESS]: (state, action) => ({
      ...state,
      isSuccess: true
    }),
    [profileInfoActions.UPDATE_PASSWORD_FAILED]: (state, action) => ({
      ...state,
      isSuccess: false
    }),
    [profileInfoActions.PROFILE_SETTING_UPDATE_REQUEST]: (state, action) => ({
      ...state,
      isSuccess: false
    }),
    [profileInfoActions.PROFILE_SETTING_UPDATE_SUCCESS]: (state, action) => ({
      ...state,
      isSuccess: true
    }),
    [profileInfoActions.PROFILE_SETTING_UPDATE_FAILED]: (state, action) => ({
      ...state,
      isSuccess: false
    })
  },
  initialAuthState
);
