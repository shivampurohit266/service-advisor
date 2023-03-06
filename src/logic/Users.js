import { toast } from "react-toastify";
import { createLogic } from "redux-logic";
import { AppConfig } from "../config/AppConfig";
import { ApiHelper } from "../helpers/ApiHelper";
import { logger } from "../helpers/Logger";
import {
  showLoader,
  hideLoader,
  usersActions,
  getUsersListSuccess,
  getUsersList,
  modelOpenRequest,
  addUserSuccess,
  editUserSuccess,
  getSingleUserSuccess
} from "./../actions";
import { DefaultErrorMessage } from "../config/Constants";

let toastId = null ;

const getUsersLogic = createLogic({
  type: usersActions.GET_USER_LIST,
  async process({ action }, dispatch, done) {
    dispatch(
      getUsersListSuccess({
        isLoading: true,
        users: []
      })
    );
    let api = new ApiHelper();
    let result = await api.FetchFromServer("/user", "/", "GET", true, {
      search:
        action.payload && action.payload.input
          ? action.payload.input
          : action.payload && action.payload.search
            ? action.payload.search
            : null,
      sort: action.payload && action.payload.sort ? action.payload.sort : null,
      status:
        action.payload && action.payload.status ? action.payload.status : null,
      type: action.payload && action.payload.type ? action.payload.type : null,
      invitaionStatus:
        action.payload && action.payload.invitaionStatus
          ? action.payload.invitaionStatus
          : null,
      limit: AppConfig.ITEMS_PER_PAGE
    });
    if (result.isError) {
      dispatch(
        getUsersListSuccess({
          isLoading: false,
          users: []
        })
      );
      done();
      return;
    } else {
      const options = result.data.data.map(user => ({
        label: `${user.firstName} ${user.lastName}`,
        value: user._id,
        data: user
      }));
      logger(
        action.payload && action.payload.callback
          ? action.payload.callback(options)
          : null
      );
      dispatch(hideLoader());
      dispatch(
        getUsersListSuccess({
          isLoading: false,
          users: result.data.data,
          totalUsers: result.data.totalUsers
        })
      );
      done();
    }
  }
});

const addUsersLogic = createLogic({
  type: usersActions.ADD_USER,
  async process({ action }, dispatch, done) {
    dispatch(showLoader());
    logger(action.payload);
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/auth",
      "/createUser",
      "POST",
      true,
      undefined,
      action.payload
    );
    if (result.isError) {
      if (!toast.isActive(toastId)) {
        toastId = toast.error(
           result.messages[0] || DefaultErrorMessage
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
      dispatch(
        modelOpenRequest({
          modelDetails: {
            addUserModal: false
          }
        })
      );
      dispatch(addUserSuccess());
      dispatch(hideLoader());
      done();
    }
  }
});
const editUsersLogic = createLogic({
  type: usersActions.EDIT_USER,
  async process({ action }, dispatch, done) {
    dispatch(showLoader());
    logger(action.payload);
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/auth",
      ["/updateUser", action.payload.id].join("/"),
      "PUT",
      true,
      undefined,
      action.payload.data
    );
    if (result.isError) {
      if (!toast.isActive(toastId)) {
        toastId = toast.error(
           result.messages[0] || DefaultErrorMessage
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

      dispatch(
        modelOpenRequest({
          modelDetails: {
            editUserModal: false
          }
        })
      );
      dispatch(hideLoader());
      dispatch(editUserSuccess());
      done();
    }
  }
});
const deleteUserLogic = createLogic({
  type: usersActions.DELETE_USER,
  async process({ action }, dispatch, done) {
    dispatch(showLoader());
    logger(action.payload);
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/user",
      "/delete",
      "POST",
      true,
      undefined,
      action.payload
    );
    if (result.isError) {
      if (!toast.isActive(toastId)) {
        toastId = toast.error(
           result.messages[0] || DefaultErrorMessage
        );
     }
      dispatch(hideLoader());
      done();
      return;
    } else {
      toast.success(result.messages[0]);
      dispatch(hideLoader());
      delete action.payload.userId;
      dispatch(
        getUsersList({
          ...action.payload
        })
      );
      done();
    }
  }
});
const updateUserStatusLogic = createLogic({
  type: usersActions.UPDATE_USER_STATUS,
  async process({ action }, dispatch, done) {
    dispatch(showLoader());
    logger(action.payload);
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/user",
      "/updateStatus",
      "POST",
      true,
      undefined,
      action.payload
    );
    if (result.isError) {
      if (!toast.isActive(toastId)) {
        toastId = toast.error(
           result.messages[0] || DefaultErrorMessage
        );
     }
      dispatch(hideLoader());
      done();
      return;
    } else {
      dispatch(hideLoader());
      delete action.payload.users;
      delete action.payload.status;
      dispatch(
        getUsersList({
          ...action.payload
        })
      );

      toast.success(result.messages[0]);
      done();
    }
  }
});

const getSingleUserDetailsLogic = createLogic({
  type: usersActions.GET_SINGLE_USER_DETAILS_REQUEST,
  async process({ action }, dispatch, done) {
    dispatch(showLoader());
    logger(action.payload);
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/user",
      "/singleUser",
      "Get",
      true,
      action.payload
    );
    if (result.isError) {
      if (!toast.isActive(toastId)) {
        toastId = toast.error(
           result.messages[0] || DefaultErrorMessage
        );
     }
      dispatch(hideLoader());
      done();
      return;
    } else {
      dispatch(hideLoader());
      dispatch(getSingleUserSuccess(result.data.data))
      if (!toast.isActive(toastId)) {
        toastId = toast.success(
           result.messages[0]
        );
     }
      done();
    }
  }
});


export const UsersLogic = [
  getUsersLogic,
  addUsersLogic,
  deleteUserLogic,
  editUsersLogic,
  updateUserStatusLogic,
  getSingleUserDetailsLogic
];
