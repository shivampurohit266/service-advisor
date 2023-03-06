import { createLogic } from "redux-logic";
import { toast } from "react-toastify";

import { ApiHelper } from "../helpers/ApiHelper";
import { logger } from "../helpers/Logger";

import {
  loginActions,
  redirectTo,
  showLoader,
  hideLoader,
  logOutRequest,
  profileInfoSuccess,
} from "./../actions";
import { DefaultErrorMessage } from "../config/Constants";
import { APP_URL } from "../config/AppConfig";
import { AppRoutes } from "../config/AppRoutes";

let toastId = null;
/**
 *
 */
const loginLogic = createLogic({
  type: loginActions.LOGIN_REQUEST,
  cancelType: loginActions.LOGIN_FAILED,
  async process({ action }, dispatch, done) {
    dispatch(showLoader());
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/auth",
      "/login",
      "POST",
      false,
      undefined,
      action.payload
    );
    if (result.isError || !result.data.data || !result.data.data.subdomain) {
      if (!toast.isActive(toastId)) {
        toastId = toast.error(
          result.messages[0] || DefaultErrorMessage
        );
      }
      dispatch(hideLoader());
      done();
      return;
    } else {
      dispatch(
        profileInfoSuccess({
          companyInfo: result.data.companyData,
          isLoading: false
        })
      );
      logger(
        `${"http"}://${window.location.host}/verify-user-details?user=${
          result.data.token
          }&key=${Date.now()}&verification=${Math.random()}`
      );
      // dispatch(
      //   redirectTo({
      //     path: AppRoutes.DASHBOARD.url
      //   })
      // );
      const hostURL = window.location.host
      console.log("hostURL",hostURL);
      console.log("APP_URL",APP_URL);
      
      window.location.href = `${"http"}://${window.location.host}/verify-user-details?user=${
        result.data.token
        }&key=${Date.now()}&verification=${Math.random()}, , "_self"`;

      done();
    }
  }
});
/**
 *
 */
const logOutLogic = createLogic({
  type: loginActions.LOGOUT_REQUEST,
  async process({ action }, dispatch, done) {
    localStorage.removeItem("token");
    window.location.href = `http://${window.location.host}/login`;
    done();
  }
});
/**
 *
 */
const forgetPasswordLogic = createLogic({
  type: loginActions.FORGET_PASSWORD_REQUEST,
  async process({ action }, dispatch, done) {
    dispatch(showLoader());
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/auth",
      "/forgot-password",
      "POST",
      false,
      undefined,
      action.payload
    );
    if (result.isError) {
      if (!toast.isActive(toastId)) {
        toastId = toast.error(result.messages[0] || result.messages);
      }
      dispatch(hideLoader());
      done();
      return;
    } else {
      logger(result);
      if (!toast.isActive(toastId)) {
        toastId = toast.success(
          result.messages[0]
        );
      }
      dispatch(hideLoader());
      dispatch(redirectTo({ path: "/login" }));
      done();
    }
  }
});
/**
 *
 */
const verifyResetTokenLogic = createLogic({
  type: loginActions.VALIDATE_RESET_REQUEST,
  async process({ action }, dispatch, done) {
    dispatch(showLoader());
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/auth",
      "/verify-link",
      "POST",
      false,
      undefined,
      action.payload
    );
    if (result.isError) {
      if (!toast.isActive(toastId)) {
        toastId = toast.error(result.messages[0] || result.messages);
      }
      dispatch(hideLoader());
      dispatch(redirectTo({ path: "/404" }));
      done();
      return;
    } else {
      dispatch(hideLoader());
      done();
    }
  }
});
/**
 *
 */
const resetPasswordLogic = createLogic({
  type: loginActions.RESET_PASSSWORD_REQUEST,
  async process({ action }, dispatch, done) {
    dispatch(showLoader());
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/auth",
      "/reset-password",
      "POST",
      false,
      undefined,
      action.payload
    );
    if (result.isError) {
      if (!toast.isActive(toastId)) {
        toastId = toast.error(result.messages[0] || result.messages);
      }
      dispatch(hideLoader());
      done();
      return;
    } else {
      dispatch(hideLoader());
      if (!toast.isActive(toastId)) {
        toastId = toast.success(
          result.messages[0]
        );
      }
      dispatch(redirectTo({ path: "/login" }));
      done();
    }
  }
});
/**
 *
 */
const verifyAccountAccessLogic = createLogic({
  type: loginActions.VERIFY_WORKSPACE_LOGIN,
  async process({ action }, dispatch, done) {
    const { payload } = action;
    logger(payload);
    const { user, key, verification } = payload;
    if (!user || !key || !verification) {
      dispatch(logOutRequest());
    }
    localStorage.setItem("token", user);
    const result = await new ApiHelper().FetchFromServer(
      "/user",
      "/getProfile",
      "GET",
      true
    );
    logger(result);
    if (result.isError) {
      dispatch(logOutRequest());
    }
    localStorage.setItem("token", user);

    // dispatch(
    //   redirectTo({
    //     path: AppRoutes.DASHBOARD.url
    //   })
    // );
    // const hostURL = window.location.host.split(".")
    window.open(`${window.location.protocol}//${window.location.host}${AppRoutes.DASHBOARD.url}`, "_self");
    done();
  }
});

/**
 *
 */
export const LoginLogics = [
  loginLogic,
  logOutLogic,
  forgetPasswordLogic,
  verifyResetTokenLogic,
  resetPasswordLogic,
  verifyAccountAccessLogic
];
