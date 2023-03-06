import { createAction } from "redux-actions";

export const InspectionActions = {
  ADD_INSPCETION: "Add new Inspection Requested!",
  ADD_INSPCETION_SUCCESS: "Add new Inspection Success!",
  ADD_INSPCETION_TEMPLATE: "Add Inspection Template Requested!",
  ADD_INSPCETION_TEMPLATE_SUCCESS: "Add Inspection Template success",
  GET_TEMPLATE_LIST: "Get All template List",
  GET_TEMPLATE_LIST_SUCCESS: "Get All template List Success",
  REMOVE_TEMPLATE: "remove template from List",
  REMOVE_TEMPLATE_SUCCESS: "Template removed successfully",
  ADD_MESSAGE_TEMPLATE: "Message Template Add Request",
  ADD_MESSAGE_TEMPLATE_SUCCESS: "Message Template Add Success",
  GET_MESSAGE_TEMPLATE: "Get All Message Template List",
  GET_MESSAGE_TEMPLATE_LIST_SUCCESS: "Get All Message Template List Success",
  UPDATE_MESSAGE_TEMPLATE: "Message Template Update Request",
  UPDATE_MESSAGE_TEMPLATE_SUCCESS: "Message Template Update Success",
  DELETE_MESSAGE_TEMPLATE: "Message Template Delete Request",
  DELETE_MESSAGE_TEMPLATE_SUCCESS: "Message Template Delete Success",
  SEARCH_MESSAGE_TEMPLATE_LIST: "Search Message Template",
  SEARCH_MESSAGE_TEMPLATE_LIST_SUCCESS: "Search Message Template Success",
  SEND_MESSAGE_TEMPLATE: "Sent Message Template",
  SEND_MESSAGE_TEMPLATE_SUCCESS: "Sent Message Template Success",
  GET_INSPECTION_LIST: "Get inspection list request",
  GET_INSPECTION_LIST_SUCCESS: "Get inspection list Success",
  ADD_INSPCETION_TO_REDUCER: "Add Inspection To Reducer!"
};

export const addNewInspection = createAction(InspectionActions.ADD_INSPCETION);
export const addInspectionSuccess = createAction(
  InspectionActions.ADD_INSPCETION_SUCCESS
);

export const addInspectionTemplate = createAction(
  InspectionActions.ADD_INSPCETION_TEMPLATE
);
export const addInspectionTemplateSuccess = createAction(
  InspectionActions.ADD_INSPCETION_TEMPLATE_SUCCESS
);

export const getTemplateList = createAction(
  InspectionActions.GET_TEMPLATE_LIST
);
export const getTemplateListSuccess = createAction(
  InspectionActions.GET_TEMPLATE_LIST_SUCCESS
);

export const removeTemplate = createAction(InspectionActions.REMOVE_TEMPLATE);
export const removeTemplateSuccess = createAction(
  InspectionActions.REMOVE_TEMPLATE_SUCCESS
);

export const addMessageTemplate = createAction(
  InspectionActions.ADD_MESSAGE_TEMPLATE
);
export const addMessageTemplateSuccess = createAction(
  InspectionActions.ADD_MESSAGE_TEMPLATE_SUCCESS
);

export const getMessageTemplate = createAction(
  InspectionActions.GET_MESSAGE_TEMPLATE
);
export const getMessageTemplateSuccess = createAction(
  InspectionActions.GET_MESSAGE_TEMPLATE_LIST_SUCCESS
);

export const updateMessageTemplate = createAction(
  InspectionActions.UPDATE_MESSAGE_TEMPLATE
);
export const updateMessageTemplateSuccess = createAction(
  InspectionActions.UPDATE_MESSAGE_TEMPLATE_SUCCESS
);

export const deleteMessageTemplate = createAction(
  InspectionActions.DELETE_MESSAGE_TEMPLATE
);
export const deleteMessageTemplateSuccess = createAction(
  InspectionActions.DELETE_MESSAGE_TEMPLATE_SUCCESS
);

export const searchMessageTemplateList = createAction(
  InspectionActions.SEARCH_MESSAGE_TEMPLATE_LIST
);
export const searchMessageTemplateListSuccess = createAction(
  InspectionActions.SEARCH_MESSAGE_TEMPLATE_LIST_SUCCESS
);

export const sendMessageTemplate = createAction(
  InspectionActions.SEND_MESSAGE_TEMPLATE
);
export const sendMessageTemplateSuccess = createAction(
  InspectionActions.SEND_MESSAGE_TEMPLATE_SUCCESS
);

export const getInspectionList = createAction(
  InspectionActions.GET_INSPECTION_LIST
);
export const getInspectionListSuccess = createAction(
  InspectionActions.GET_INSPECTION_LIST_SUCCESS
);

export const addInspcetionToReducer = createAction(
  InspectionActions.ADD_INSPCETION_TO_REDUCER
);
