import { handleActions } from "redux-actions";
import { matrixActions } from "./../actions";

const initialAuthState = {
    matrixList: [],
    isLoading: false,
    matrixData: {
        isSuccess: false,
        isEditSuccess: false,
        isDeleteSuccess: false
    }
};

export const matrixListReducer = handleActions(
    {
        [matrixActions.GET_MATRIX_LIST_START]: (state, action) => ({
            ...state,
            matrixList: action.payload.matrixList,
            isLoading: action.payload.isLoading
        }),
        [matrixActions.GET_MATRIX_LIST_SUCCESS]: (state, action) => ({
            ...state,
            matrixList: action.payload.matrixList,
            isLoading: action.payload.isLoading
        }),
        [matrixActions.GET_MATRIX_LIST_FAILED]: (state, action) => ({
            ...state,
            matrixList: action.payload.matrixList,
            isLoading: false
        }),
        [matrixActions.ADD_MATRIX_REQUEST]: (state, action) => ({
            ...state,
            matrixData: {
                ...state.matrixData,
                isSuccess: false
            }
        }),
        [matrixActions.ADD_MATRIX_FAILED]: (state, action) => ({
            ...state,
            matrixData: {
                ...state.matrixData,
                isSuccess: false
            }
        }),
        [matrixActions.ADD_MATRIX_SUCCESS]: (state, action) => ({
            ...state,
            matrixData: {
                ...state.matrixData,
                isSuccess: true,
            }
        }),
        [matrixActions.UPDATE_MATRIX_REQUEST]: (state, action) => ({
            ...state,
            matrixData: {
                ...state.matrixData,
                isEditSuccess: false
            }
        }),
        [matrixActions.UPDATE_MATRIX_SUCCESS]: (state, action) => ({
            ...state,
            matrixData: {
                ...state.matrixData,
                isEditSuccess: true
            }
        }),
        [matrixActions.DELETE_MATRIX_REQUEST]: (state, action) => ({
            ...state,
            matrixData: {
                ...state.matrixData,
                isDeleteSuccess: false
            }
        }),
        [matrixActions.DELETE_MATRIX_SUCCESS]: (state, action) => ({
            ...state,
            matrixData: {
                ...state.matrixData,
                isDeleteSuccess: true
            }
        })
    },
    initialAuthState
);
