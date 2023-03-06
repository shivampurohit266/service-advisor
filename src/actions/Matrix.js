import { createAction } from "redux-actions";

export const matrixActions = {
  GET_MATRIX_LIST: "Matrix list Requested!",
  GET_MATRIX_LIST_SUCCESS: "Matrix list success!",
  GET_MATRIX_LIST_FAILED: 'Matrix list failed!',
  GET_MATRIX_LIST_START: 'Matrix list Started!',
  ADD_MATRIX_REQUEST: "Matrix add request!",
  ADD_MATRIX_FAILED: "Matrix add failed",
  ADD_MATRIX_SUCCESS: "Matrix add success!",
  UPDATE_MATRIX_REQUEST: "Matrix update request!",
  UPDATE_MATRIX_SUCCESS: "Matrix update success!",
  DELETE_MATRIX_REQUEST: "Matrix delete request!",
  DELETE_MATRIX_SUCCESS: "Matrix delete success!"
};

export const getMatrixList = createAction(matrixActions.GET_MATRIX_LIST);
export const getMatrixListSuccess = createAction(
  matrixActions.GET_MATRIX_LIST_SUCCESS
);
export const getMatrixListFail = createAction(
  matrixActions.GET_MATRIX_LIST_FAILED
);
export const getMatrixListStart = createAction(
  matrixActions.GET_MATRIX_LIST_START
);
export const addMatrixRequest = createAction(matrixActions.ADD_MATRIX_REQUEST);
export const addMatrixSuccess = createAction(matrixActions.ADD_MATRIX_SUCCESS);
export const addMatrixFailed = createAction(matrixActions.ADD_MATRIX_FAILED);
export const updateMatrixRequest = createAction(matrixActions.UPDATE_MATRIX_REQUEST);
export const updateMatrixSuccess = createAction(matrixActions.UPDATE_MATRIX_SUCCESS);
export const deleteMatrixRequest = createAction(matrixActions.DELETE_MATRIX_REQUEST);
export const deleteMatrixSuccess = createAction(matrixActions.DELETE_MATRIX_SUCCESS);