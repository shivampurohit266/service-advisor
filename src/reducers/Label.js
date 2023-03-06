import { handleActions } from "redux-actions";
import { labelAction } from "../actions";

const initialState = {
    label: [],
    isLoading: true,
};

export const labelReducer = handleActions(
    {
        [labelAction.GET_LABEL_LIST_SUCCESS]: (state, { payload }) => ({
            ...state,
            ...payload,
        }),
        [labelAction.ADD_LABEL]: (state, action) => ({
            ...state,
            label: action.payload.label
        }),
        [labelAction.ADD_LABEL_SUCCESS]: (state, action) => ({
            ...state,
            label: action.payload.label
        }),
    },
    initialState
);
