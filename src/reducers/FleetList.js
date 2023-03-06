import { handleActions } from 'redux-actions';
import { fleetListActions, fleetAddActions, fleetEditAction, customerFleetListAction } from "./../actions";

const initialAuthState = {
    fleetData: [],
    customerFleetData: [],
    isLoading: false,
    totalFleets: 100,
    isSuccess: false,
    isEditSuccess: false,
};

export const fleetReducer = handleActions((
    {
        [fleetListActions.FLEET_LIST_START]: (state, action) => ({
            ...state,
            fleetData: action.payload.fleetData,
            isLoading:action.payload.isLoading
        }),
        [fleetListActions.FLEET_LIST_SUCCESS]: (state, action) => ({
            ...state,
            fleetData: action.payload.fleetData,
            isLoading:action.payload.isLoading
        }),
        [fleetListActions.FLEET_LIST_FAILED]: (state, action) => ({
            ...state,
            fleetData: action.payload.fleetData,
            isLoading:false
        }),
        [fleetAddActions.FLEET_ADD_SUCCESS]: (state, action) => ({
            ...state,
            fleetData: action.payload.fleetData,
            isSuccess: true,
        }),
        [fleetEditAction.EDIT_FLEET_SUCCESS]: (state, action) => ({
            ...state,
            fleetData: action.payload.fleetData,
            isEditSuccess: true,
        }),
        [customerFleetListAction.CUSTOMER_FLEET_LIST_START]: (state, action) => ({
            ...state,
            customerFleetData: action.payload.customerFleetData
        })
    }),
    initialAuthState
);