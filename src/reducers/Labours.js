import { handleActions } from 'redux-actions';
import { labourActions } from "./../actions";

const initialAuthState = {
    labourData: [],
    isLoading: false,
    totalFleets: 100,
    isSuccess: false,
    isEditSuccess: false,
};

export const labourReducer = handleActions((
    {
        [labourActions.LABOUR_LIST_START]: (state, action) => ({
            ...state,
            labourData: action.payload.labourData,
            isLoading: action.payload.isLoading
        }),
        [labourActions.LABOUR_LIST_SUCCESS]: (state, action) => ({
            ...state,
            labourData: action.payload.labourData,
            isLoading: action.payload.isLoading
        }),
        [labourActions.LABOUR_LIST_FAILED]: (state, action) => ({
            ...state,
            labourData: action.payload.labourData,
        }),
        [labourActions.LABOUR_ADD_SUCCESS]: (state, action) => ({
            ...state,
            labourData: action.payload.labourData,
            isSuccess: true,
        }),
        [labourActions.EDIT_LABOUR_SUCCESS]: (state, action) => ({
            ...state,
            labourData: action.payload.labourData,
            isEditSuccess: true,
        }),
    
    }),
    initialAuthState
);