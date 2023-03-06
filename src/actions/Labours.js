import { createAction } from "redux-actions";

export const labourActions = {
  LABOUR_ADD_REQUEST: 'LabourAdd Requested!',
  LABOUR_ADD_SUCCESS: 'LabourAdd successfully!',
  LABOUR_ADD_FAILED: 'LabourAdd failed!',
  LABOUR_ADD_START: 'LabourAdd Started!',
  LABOUR_LIST_REQUEST: 'LabourList Requested!',
  LABOUR_LIST_SUCCESS: 'LabourList successfully!',
  LABOUR_LIST_FAILED: 'LabourList failed!',
  LABOUR_LIST_START: 'LabourList Started!',
  EDIT_LABOUR_REQUESTED: "Edit labour Requested!",
  EDIT_LABOUR_SUCCESS: "Edit labour Success!",
  DELETE_LABOUR: "Delete labour Requested!",
  ADD_SERVICE_LABOR: "Add labor to service",
};

export const labourAddRequest = createAction(labourActions.LABOUR_ADD_REQUEST);
export const labourAddStarted = createAction(labourActions.LABOUR_ADD_START);
export const labourAddSuccess = createAction(labourActions.LABOUR_ADD_SUCCESS);
export const labourAddFailed = createAction(labourActions.LABOUR_ADD_FAILED);
export const labourListRequest = createAction(labourActions.LABOUR_LIST_REQUEST);
export const labourListStarted = createAction(labourActions.LABOUR_LIST_START);
export const labourListSuccess = createAction(labourActions.LABOUR_LIST_SUCCESS);
export const labourListFailed = createAction(labourActions.LABOUR_LIST_FAILED);

export const labourEditRequest = createAction(labourActions.EDIT_LABOUR_REQUESTED)
export const labourEditSuccess = createAction(labourActions.EDIT_LABOUR_SUCCESS)
export const deleteLabour = createAction(labourActions.DELETE_LABOUR);
export const addLaborToService = createAction(labourActions.ADD_SERVICE_LABOR)

