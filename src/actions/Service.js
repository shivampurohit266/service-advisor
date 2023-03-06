import { createAction } from "redux-actions";

export const serviceActions = {
    GET_SERVICE_LIST: "Service list Requested!",
    GET_SERVICE_LIST_SUCCESS: "Service list success!",
    GET_SERVICE_DATA_SUCCESS: " Service data success!",
    ADD_SERVICE: "Add new service Requested!",
    ADD_SERVICE_SUCCESS: "Add new service Success!",
    ADD_CANNED_SERVICE: "Add new canned service Requested!",
    ADD_CANNED_SERVICE_SUCCESS: "Add new canned service Success!",
    EDIT_SERVICE: "Edit service Requested!",
    EDIT_SERVICE_SUCCESS: "Edit service Success!",
    DELETE_SERVICE: "Delete service Requested!",
    GET_CANNED_SERVICE_LIST: "Get canned service list Requested!",
    GET_CANNED_SERVICE_LIST_SUCCESS: "Get canned service list success!",
    DELETE_CANNED_SERVICE_REQUEST: "Delete canned service request",
    DELETE_CANNED_SERVICE_SUCCESS: "Delete canned service success",
    GET_ALL_SERVICE_LIST_REQUEST: "All service list request",
    GET_ALL_SERVICE_LIST_SUCCESS: "All service list success",
    SUBMIT_SERVICE_DATA_SUCCESS: "Submit service data success",
    UPDATE_ORDER_SERVICE_DATA: "Update order service data!"
};

export const getServiceList = createAction(serviceActions.GET_SERVICE_LIST);
export const getServiceListSuccess = createAction(
    serviceActions.GET_SERVICE_LIST_SUCCESS
);
export const addNewService = createAction(serviceActions.ADD_SERVICE);
export const addServiceSuccess = createAction(serviceActions.ADD_SERVICE_SUCCESS);
export const editService = createAction(serviceActions.EDIT_SERVICE);
export const editServiceSuccess = createAction(serviceActions.EDIT_SERVICE_SUCCESS);
export const deleteService = createAction(serviceActions.DELETE_SERVICE);
export const getCannedServiceList = createAction(serviceActions.GET_CANNED_SERVICE_LIST);
export const getCannedServiceListSuccess = createAction(serviceActions.GET_CANNED_SERVICE_LIST_SUCCESS);
export const addNewCannedService = createAction(serviceActions.ADD_CANNED_SERVICE);
export const addCannedServiceSuccess = createAction(serviceActions.ADD_CANNED_SERVICE_SUCCESS);
export const deleteCannedServiceRequest = createAction(serviceActions.DELETE_CANNED_SERVICE_REQUEST);
export const deleteCannedServiceSuccess = createAction(serviceActions.DELETE_CANNED_SERVICE_SUCCESS);
export const getAllServiceListRequest = createAction(serviceActions.GET_ALL_SERVICE_LIST_REQUEST);
export const getAllServiceListSuccess = createAction(serviceActions.GET_ALL_SERVICE_LIST_SUCCESS);
export const getServiceDataSuccess = createAction(serviceActions.GET_SERVICE_DATA_SUCCESS);

export const submitServiceDataSuccess = createAction(serviceActions.SUBMIT_SERVICE_DATA_SUCCESS)

export const updateOrderServiceData = createAction(serviceActions.UPDATE_ORDER_SERVICE_DATA)