import { createAction } from "redux-actions";

export const loginActions = {
  LOGIN_REQUEST: "Login Requested!",
  LOGOUT_REQUEST: "Logout Started!",
  FORGET_PASSWORD_REQUEST: "Forget Password Started!",
  VALIDATE_RESET_REQUEST: "Reset Token Validation Started!",
  RESET_PASSSWORD_REQUEST: "Reset Password Started!",
  VERIFY_WORKSPACE_LOGIN: "Verify the login for the workspace!"
};

export const loginRequest = createAction(loginActions.LOGIN_REQUEST);
export const logOutRequest = createAction(loginActions.LOGOUT_REQUEST);
export const forgetPasswordRequest = createAction(
  loginActions.FORGET_PASSWORD_REQUEST
);
export const validateResetToken = createAction(
  loginActions.VALIDATE_RESET_REQUEST
);
export const resetPasswordRequest = createAction(
  loginActions.RESET_PASSSWORD_REQUEST
);
export const verifyWorkspaceLogin = createAction(
  loginActions.VERIFY_WORKSPACE_LOGIN
);
