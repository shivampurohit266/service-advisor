import { createAction } from "redux-actions";

export const inventoryPartsActions = {
  GET_VENDORS_LIST: "Get vendors list for part!",
  GET_VENDORS_LIST_SUCCESS: "Get vendors list for part success!",
  GET_PARTS_LIST: "Get inventory list for part!",
  GET_VENDORS_LIST_START: "Get inventory list for part started!",
  GET_PARTS_LIST_SUCCESS: "Get inventory list for part success!",
  ADD_PART_TO_INVENTORY: "Add part to inventory started!",
  UPDATE_PART_TO_INVENTORY: "Update part to inventory started!",
  DELETE_PART_FROM_INVENTORY: "Delete part from inventory started!",
  ADD_SERVICE_PART: "Add part to service",
};

export const getInventoryPartVendors = createAction(
  inventoryPartsActions.GET_VENDORS_LIST
);
export const getInventoryPartVendorsSuccess = createAction(
  inventoryPartsActions.GET_VENDORS_LIST_SUCCESS
);

export const requestAddPart = createAction(
  inventoryPartsActions.ADD_PART_TO_INVENTORY
);

export const getInventoryPartsList = createAction(
  inventoryPartsActions.GET_PARTS_LIST
);
export const getInventoryPartsListStarted = createAction(
  inventoryPartsActions.GET_VENDORS_LIST_START
);
export const getInventoryPartsListSuccess = createAction(
  inventoryPartsActions.GET_PARTS_LIST_SUCCESS
);
export const deletePartFromInventory = createAction(
  inventoryPartsActions.DELETE_PART_FROM_INVENTORY
);
export const updatePartFromInventory = createAction(
  inventoryPartsActions.UPDATE_PART_TO_INVENTORY
);
export const addPartToService = createAction(inventoryPartsActions.ADD_SERVICE_PART)