import { createAction } from "redux-actions";

export const signUpActions = {
  SIGNUP_REQUEST: "SignUp Requested!",
  RESEND_LINK: "Resend invitation link!",
  VERIFY_ACCOUNT: "Request Verify Account!",
  GENERATE_PASSWORD: "Request Generate Password!",
  VERIFY_GENERATE_PASSWORD: "Request Generate Password link verfication!",
  ENQURY_REQUEST: "Request For enquiry",
  ENQURY_REQUEST_SUCCESS: "Request For enquiry success!"
};

export const signUpRequest = createAction(signUpActions.SIGNUP_REQUEST);
export const resendRequest = createAction(signUpActions.RESEND_LINK);
export const verifyUserAccount = createAction(signUpActions.VERIFY_ACCOUNT);
export const verifyGeneratePasswordLink = createAction(
  signUpActions.VERIFY_GENERATE_PASSWORD
);
export const generatePassword = createAction(signUpActions.GENERATE_PASSWORD);
export const enquiryRequest = createAction(signUpActions.ENQURY_REQUEST);
export const enquiryRequestSuccess = createAction(signUpActions.ENQURY_REQUEST_SUCCESS);