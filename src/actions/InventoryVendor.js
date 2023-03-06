import { createAction } from "redux-actions";

export const vendorActions = {
  ADD_VENDOR: "Add new vendor Requested!",
  ADD_VENDOR_SUCCESS: "Add new vendor Success!",
  EDIT_VENDOR: "Edit vendor Requested!",
  EDIT_VENDOR_SUCCESS: "Edit vendor Success!",
  GET_VENDOR_LIST: "User list Requested!",
  GET_VENDOR_LIST_SUCCESS: "Vendor list success!",
  DELETE_VENDOR: "Delete vendor Requested!",
  DELETE_VENDOR_SUCCESS: "Delete vendor Success!"
};

export const getVendorsList = createAction(vendorActions.GET_VENDOR_LIST);
export const getVendorsListSuccess = createAction(
  vendorActions.GET_VENDOR_LIST_SUCCESS
);
export const addNewVendor = createAction(vendorActions.ADD_VENDOR);
export const addVendorSuccess = createAction(vendorActions.ADD_VENDOR_SUCCESS);

export const editVendor = createAction(vendorActions.EDIT_VENDOR);
export const editVendorSuccess = createAction(
  vendorActions.EDIT_VENDOR_SUCCESS
);

export const deleteVendor = createAction(vendorActions.DELETE_VENDOR);
export const deleteVendorSuccess = createAction(
  vendorActions.DELETE_VENDOR_SUCCESS
);
