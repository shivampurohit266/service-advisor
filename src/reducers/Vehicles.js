import { handleActions } from "redux-actions";
import { vehicleActions } from "./../actions";

const initialAuthState = {
  vehicleAddInfo: {},
  //isLoading: true
};

export const vehicleAddInfoReducer = handleActions(
  {
    [vehicleActions.VEHICLES_ADD_REQUEST]: (state, action) => ({
      ...state,
      vehicleAddInfo: {},
      // isLoading: true
    }),
    [vehicleActions.VEHICLES_ADD_SUCCESS]: (state, action) => ({
      ...state,
      vehicleAddInfo: action.payload.vehicleAddInfo ? action.payload.vehicleAddInfo : {},
      //isLoading: action.payload.isLoading
    }),
    [vehicleActions.VEHICLES_ADD_FAILED]: (state, action) => ({
      ...state,
      vehicleAddInfo: {},
      //isLoading: action.payload.isLoading
    })
  },
  initialAuthState
);

const listVehiclesState = {
  isLoading: false,
  vehicleList: [],
  totalVehicles: [],
  importError: undefined
};

export const vehicleListReducer = handleActions(
  {
    [vehicleActions.VEHICLES_GET_START]: (state, action) => ({
      ...state,
      isLoading: action.payload.isLoading,
      vehicleList: action.payload.vehicleList,
      totalVehicles: action.payload.totalVehicles
    }),
    [vehicleActions.VEHICLES_GET_SUCCESS]: (state, action) => ({
      ...state,
      isLoading: action.payload.isLoading,
      vehicleList: action.payload.vehicleList,
      totalVehicles: action.payload.totalVehicles
    }),
    [vehicleActions.VEHICLES_GET_FAILED]: (state, action) => ({
      ...state,
      isLoading: false,
      vehicleList: [],
      totalVehicles: []
    }),
    [vehicleActions.IMPORT_VEHICLE_REQ_UPDATE]: (state, action) => ({
      ...state,
      ...action.payload
    })
  },
  listVehiclesState
);
