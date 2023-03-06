import { handleActions } from "redux-actions";
import { vendorActions } from "../actions"

const initialState = {
  vendors:[],
  isLoading:false,
  totalVendors: 100,
  vendorData:{
    isSuccess: false,
    data: {}
  }
}

export const vendorsReducer = handleActions(
  {
    [vendorActions.GET_VENDOR_LIST_SUCCESS]: (state, { payload }) => ({
      ...state,
      ...payload
    }),
    [vendorActions.ADD_VENDOR]: (state, action) => ({
      ...state,
      vendorData: {
        ...state.userData,
        isSuccess: false
      }
    }),
    [vendorActions.ADD_VENDOR_SUCCESS]: (state, action) => ({
      ...state,
      vendorData: {
        isSuccess: true,
        data: {}
      }
    }),
    [vendorActions.DELETE_VENDOR]: (state, action) => ({
      ...state,
      vendorData: {
        isSuccess: true,
        data: {}
      }
    }),
  },
  initialState
)