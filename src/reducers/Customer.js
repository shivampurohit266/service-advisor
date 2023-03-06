import { handleActions } from "redux-actions";
import { customersAddActions } from "./../actions";

const initialAuthState = {
  customerAddInfo: {}
};

const listCustomerState = {
  isLoading: false,
  customers: [],
  totalUsers: [],
  getCustomerDetails: false,
  importError: undefined
};

export const customerInfoReducer = handleActions(
  {
    [customersAddActions.CUSTOMER_ADD_REQUEST]: (state, action) => ({
      customerAddInfo: {}
    }),
    [customersAddActions.CUSTOMER_ADD_SUCCESS]: (state, action) => ({
      ...state,
      customerAddInfo: action.payload.customerAddInfo
    }),
    [customersAddActions.CUSTOMER_ADD_FAILED]: (state, action) => ({
      ...state,
      customerAddInfo: {}
    })
  },
  initialAuthState
);

export const customerListReducer = handleActions(
  {
    [customersAddActions.CUSTOMER_GET_START]: (state, action) => ({
      ...state,
      isLoading: action.payload.isLoading,
      customers: action.payload.customers,
      totalCustomers: action.payload.totalCustomers
    }),
    [customersAddActions.CUSTOMER_GET_SUCCESS]: (state, action) => ({
      ...state,
      isLoading: action.payload.isLoading,
      customers: action.payload.customers,
      totalCustomers: action.payload.totalCustomers
    }),
    [customersAddActions.CUSTOMER_GET_FAILED]: (state, action) => ({
      ...state,
      isLoading: false,
      customers: [],
      totalCustomers: []
    }),
    [customersAddActions.IMPORT_CUSTOMER_REQ_UPDATE]: (state, action) => ({
      ...state,
      ...action.payload
    }),
    [customersAddActions.CUSTOMER_DETAILS_REQUEST]: (state, action) => ({
      ...state,
      getCustomerDetails: false
    }),
    [customersAddActions.CUSTOMER_DETAILS_SUCCESS]: (state, action) => ({
      ...state,
      getCustomerDetails: true
    })
  },
  listCustomerState
);
