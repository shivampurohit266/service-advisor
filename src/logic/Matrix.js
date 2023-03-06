import { createLogic } from "redux-logic";
import { ApiHelper } from "../helpers/ApiHelper";
import {
  matrixActions,
  getMatrixListStart,
  getMatrixListFail,
  getMatrixListSuccess,
  showLoader,
  hideLoader,
  modelOpenRequest,
  addMatrixSuccess,
  addMatrixFailed,
  deleteMatrixSuccess,
  getMatrixList
} from "./../actions";
import { logger } from "../helpers/Logger";
import { toast } from "react-toastify";
import { DefaultErrorMessage } from "../config/Constants";
let toastId = null;

const getMatrixLogic = createLogic({
  type: matrixActions.GET_MATRIX_LIST,
  cancelType: matrixActions.GET_MATRIX_LIST_FAILED,
  async process({ action, getState }, dispatch, done) {
    dispatch(
      getMatrixListStart({
        matrixList: [],
        isLoading: true
      })
    );
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/matrix",
      "/getAllMatrix",
      "GET",
      true,
      { search: action.payload && action.payload.input ? action.payload.input : action.payload && action.payload.search ? action.payload.search : null, sort: action.payload && action.payload.sort ? action.payload.sort : null }
    );
    logger(result);
    if (result.isError) {
      if (!toast.isActive(toastId)) {
        toastId = toast.error(
          result.messages[0] || DefaultErrorMessage
        );
      }
      dispatch(
        getMatrixListFail({
          matrixList: [],
          isLoading: false
        })
      );
    }
    else {
      const options = result.data.data.map(matrix => ({
        label: matrix.matrixName,
        value: matrix._id
      }));
      logger(action.payload && action.payload.callback ? action.payload.callback(options) : null)
      dispatch(
        getMatrixListSuccess({
          matrixList: result.data.data,
          isLoading: false
        })
      );
    }
    done();

  }
});

const addPriceMatrixLogic = createLogic({
  type: matrixActions.ADD_MATRIX_REQUEST,
  async process({ action }, dispatch, done) {
    dispatch(showLoader());
    logger(action.payload);
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/matrix",
      "/addMatrix",
      "POST",
      true,
      undefined,
      action.payload
    );
    if (result.isError) {
      dispatch(addMatrixFailed());
      dispatch(
        modelOpenRequest({
          modelDetails: {
            matrixAddModalOpen: true
          }
        })
      );
      if (!toast.isActive(toastId)) {
        toastId = toast.error(result.messages[0]);
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
      dispatch(addMatrixSuccess());
      dispatch(
        modelOpenRequest({
          modelDetails: {
            matrixAddModalOpen: false
          }
        })
      );
      dispatch(hideLoader());
      done();
    }
  }
});

const updateMatrixLogic = createLogic({
  type: matrixActions.UPDATE_MATRIX_REQUEST,
  async process({ action }, dispatch, done) {
    dispatch(showLoader());
    logger(action.payload);
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/matrix",
      "/updateMatrix",
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
      dispatch(
        getMatrixList({
          ...action.payload
        })
      );
      dispatch(
        modelOpenRequest({
          modelDetails: {
            matrixAddModalOpen: false
          }
        })
      );
      dispatch(hideLoader());
      done();
    }
  }
});

const deleteMatrixLogic = createLogic({
  type: matrixActions.DELETE_MATRIX_REQUEST,
  async process({ action }, dispatch, done) {
    dispatch(showLoader());
    logger(action.payload);
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/matrix",
      "/delete",
      "DELETE",
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
      dispatch(hideLoader());
      dispatch(deleteMatrixSuccess())
      delete action.payload.matrixId;
      dispatch(
        getMatrixList({
          ...action.payload
        })
      );
      done();
    }
  }
});


export const MatrixLogic = [
  getMatrixLogic,
  addPriceMatrixLogic,
  updateMatrixLogic,
  deleteMatrixLogic,
];
