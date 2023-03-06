import { createLogic } from "redux-logic";
import { ApiHelper } from "../helpers/ApiHelper";
import { toast } from "react-toastify";
import { DefaultErrorMessage } from "../config/Constants";
import {
   homePageActions,
   siteSettingActions,
   getHomePageSucc,
   getSiteSettingSucc,
   // showLoader,
   // hideLoader,
} from "./../actions";

let toastId = null;

const getHomePageLogic = createLogic({
   type: homePageActions.GET_HOME_PAGE_REQUEST,
   cancelType: homePageActions.GET_HOME_PAGE_FAILED,
   async process({ action }, dispatch, done) {
      dispatch(getHomePageSucc({
            isLoading: true
         }))
      let api = new ApiHelper();
      let result = await api.FetchFromServer(
         "/home-page",
         "/home",
         "GET",
         false,
         undefined,
         undefined
      );
      if (result.isError) {
         if (!toast.isActive(toastId)) {
            toastId = toast.error(result.messages[0] || DefaultErrorMessage);
         }
         dispatch(getHomePageSucc({
            isLoading: false
         }))
         done();
         return;
      } else {
         dispatch(getHomePageSucc({
            homePageDetails: result.data.data,
            isLoading: false
         }))
         done();
      }
   }
});

const getSiteSettingLogic = createLogic({
   type:siteSettingActions.GET_SITE_SETTING_REQUEST,
   cancelType:siteSettingActions.GET_SITE_SETTING_FAILED,
   async process({ action }, dispatch, done) {
      let api = new ApiHelper();
      let result = await api.FetchFromServer(
         "/site-setting",
         "/",
         "GET",
         false,
         undefined,
         undefined
      );
      if (result.isError) {
         if (!toast.isActive(toastId)) {
            toastId = toast.error(result.messages[0] || DefaultErrorMessage);
         }
         dispatch(getSiteSettingSucc({
            isLoading: false
         }))
         done();
         return;
      } else {
         dispatch(getSiteSettingSucc({
            settingDetails: result.data.data,
            isLoading: false
         }))
         done();
      }
   }
})

export const HomePageLogic = [
   getHomePageLogic,
   getSiteSettingLogic
];