import { createAction } from "redux-actions";

export const labelAction = {
    GET_LABEL_LIST: "Label list Requested!",
    GET_LABEL_LIST_SUCCESS: "Label list success!",
    ADD_LABEL: "Add new label Requested!",
    ADD_LABEL_SUCCESS: "Add new label Success!",
    EDIT_LABEL: "Edit label Requested!",
    EDIT_LABEL_SUCCESS: "Edit label Success!",
    DELETE_LABEL: "Delete label Requested!",
};

export const getLabelList = createAction(labelAction.GET_LABEL_LIST);
export const getLabelListSuccess = createAction(
    labelAction.GET_LABEL_LIST_SUCCESS
);
export const addNewLabel = createAction(labelAction.ADD_LABEL);
export const addLabelSuccess = createAction(labelAction.ADD_LABEL_SUCCESS);
export const editLabel = createAction(labelAction.EDIT_LABEL);
export const editLabelSuccess = createAction(labelAction.EDIT_LABEL_SUCCESS);
export const deleteLabel = createAction(labelAction.DELETE_LABEL);