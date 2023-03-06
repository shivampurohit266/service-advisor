import { createLogic } from "redux-logic";
import {
  fleetAddStarted,
  fleetAddActions,
  fleetAddSuccess,
  hideLoader,
  showLoader,
  fleetListActions,
  fleetListStarted,
  fleetListSuccess,
  fleetEditSuccess,
  fleetEditAction,
  fleetDeleteActions,
  fleetListRequest,
  fleetUpdateStatusAction,
  customerFleetListAction,
  getCustomerfleetListStarted
} from "./../actions";
import { ApiHelper } from "../helpers/ApiHelper";
import { toast } from "react-toastify";
import { logger } from "../helpers/Logger";
import { AppConfig } from "../config/AppConfig";
import { DefaultErrorMessage } from "../config/Constants";

let toastId = null ;

const fleetAddLogic = createLogic({
  type: fleetAddActions.FLEET_ADD_REQUEST,
  cancelType: fleetAddActions.FLEET_ADD_FAILED,
  async process({ action }, dispatch, done) {
    dispatch(
      fleetAddStarted({
        fleetData: []
      }),
      showLoader()
    );
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/",
      "fleet/addFleet",
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
      dispatch(hideLoader());
      dispatch(fleetAddSuccess());
      dispatch(
        fleetListRequest({ page: action.payload.page ? action.payload.page : 1, search: action.payload.search ? action.payload.search : null, sort: action.payload.sort ? action.payload.sort : null, status: action.payload.status ? action.payload.status : null })
      );
      done();
    }
  }
});

const fleetListLogic = createLogic({
  type: fleetListActions.FLEET_LIST_REQUEST,
  cancelType: fleetListActions.FLEET_LIST_FAILED,
  async process({ action }, dispatch, done) {
    dispatch(
      fleetListStarted({
        isLoading: true,
        fleetData: []
      }),
      //showLoader()
    );
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/",
      "fleet/fleetList",
      "GET",
      true,
      {
        ...action.payload,
        limit: AppConfig.ITEMS_PER_PAGE
      },
      undefined
    );
    if (result.isError) {
      if (!toast.isActive(toastId)) {
        toastId = toast.error(
           result.messages[0] || DefaultErrorMessage
        );
     }
      //dispatch(hideLoader());
      done();
      return;
    } else {
      if (!toast.isActive(toastId)) {
        toastId = toast.success(
           result.messages[0]
        );
     }
      dispatch(
        fleetListSuccess({
          fleetData: result.data,
          isLoading: false
        }),
        //hideLoader()
      );
      done();
    }
  }
});

const editFleetLogic = createLogic({
  type: fleetEditAction.EDIT_FLEET_REQUESTED,
  async process({ action }, dispatch, done) {
    dispatch(showLoader());
    logger(action.payload);
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/fleet",
      "/updateFleet",
      "PUT",
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
      dispatch(hideLoader());
      dispatch(
        fleetEditSuccess({
          ...action.payload
        })
      );
      dispatch(
        fleetListRequest({ page: action.payload.page ? action.payload.page : 1, search: action.payload.search ? action.payload.search : null, sort: action.payload.sort ? action.payload.sort : null, status: action.payload.status ? action.payload.status : null })
      );
      done();
    }
  }
});

const deleteFleetLogic = createLogic({
  type: fleetDeleteActions.DELETE_FLEET,
  async process({ action }, dispatch, done) {
    dispatch(showLoader());
    logger(action.payload);
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/fleet",
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
      delete action.payload.fleetId;
      dispatch(
        fleetListRequest({
          ...action.payload
        })
      );
      done();
    }
  }
});

const updateFleetStatusLogic = createLogic({
  type: fleetUpdateStatusAction.UPDATE_FLEET_STATUS,
  async process({ action }, dispatch, done) {
    dispatch(showLoader());
    logger(action.payload);
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/fleet",
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
      toast.success(result.messages[0]);
      dispatch(hideLoader());
      delete action.payload.fleets;
      delete action.payload.status;
      dispatch(
        fleetListRequest({
          ...action.payload
        })
      );
      done();
    }
  }
});

const customerFleetListLogic = createLogic({
  type: customerFleetListAction.CUSTOMER_FLEET_LIST_REQUEST,
  cancelType: customerFleetListAction.CUSTOMER_FLEET_LIST_Failed,
  async process({ action }, dispatch, done) {
    dispatch(
      getCustomerfleetListStarted({
        customerFleetData: []
      }),
      showLoader()
    );
    logger(action.payload);
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/",
      "fleet/customerFleet",
      "GET",
      true,
      undefined,
      undefined
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
        getCustomerfleetListStarted({
          customerFleetData: result.data.data
        }),
        hideLoader()
      );
      done();
    }
  }
});

export const FleetLogic = [
  fleetAddLogic,
  fleetListLogic,
  editFleetLogic,
  deleteFleetLogic,
  updateFleetStatusLogic,
  customerFleetListLogic
];
