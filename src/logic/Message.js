import { toast } from "react-toastify";
import { createLogic } from "redux-logic";
import { ApiHelper } from "../helpers/ApiHelper";
// import { logger } from "../helpers/Logger";
import {
  sendMessageSuccess,
  MessageAction,
  //showLoader,
  hideLoader,
  //getOrderDetailsRequest,
  verifyLinkRequest,
  deleteNotesSuccess,
  addNewActivity
} from "../actions"

let toastId = null ;

const sentMessageLogic = createLogic({
  type: MessageAction.SEND_MESSAGE,
  async process({ action }, dispatch, done) {
    // dispatch(showLoader());
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/message",
      "/sendMessage",
      "POST",
      true,
      undefined,
      action.payload
    );
    if (result.isError) {
      if (!toast.isActive(toastId)) {
        toastId = toast.error(
           result.messages[0]
        );
     }
      dispatch(hideLoader());
      done();
      return;
    } else {
      if (!toast.isActive(toastId)) {
        toastId = toast.success(
           result.messages[0]
        );
     }
      dispatch(sendMessageSuccess(result.data.data));
      // const data = {
      //   "_id": action.payload.orderId
      // }
      // dispatch(getOrderDetailsRequest(data))
      const data = {
        name: `added a new message`,
        type: "NEW_MESSAGE",
        orderId: action.payload.orderId
      };
      dispatch(addNewActivity(data));
      if (action.payload.isSummary) {
        dispatch(verifyLinkRequest(action.payload.query))
      }
      // dispatch(hideLoader());
      done();
    }
  }
});

const deleteNotesLogic = createLogic({
  type: MessageAction.DELETE_NOTES,
  async process({ action }, dispatch, done) {
    //dispatch(showLoader());
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/message",
      "/updateNotes",
      "PUT",
      true,
      undefined,
      action.payload
    );
    if (result.isError) {
      if (!toast.isActive(toastId)) {
        toastId = toast.error(
           result.messages[0]
        );
     }
     // dispatch(hideLoader());
      done();
      return;
    } else {
      if (!toast.isActive(toastId)) {
        toastId = toast.success(
           result.messages[0]
        );
     }
      dispatch(deleteNotesSuccess(result.data.data));
      // const data = {
      //   "_id": action.payload.orderId
      // }
      //dispatch(getOrderDetailsRequest(data))
      //dispatch(hideLoader());
      done();
    }
  }
});



export const MessageLogic = [
  sentMessageLogic,
  deleteNotesLogic
];