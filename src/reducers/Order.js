import { handleActions } from "redux-actions";

import { orderActions, serviceActions } from "../actions";

const initialState = {
  orderId: {},
  orderData: {
    orders: [],
    isLoading: true
  },
  orderStatus: [],
  orderItems: [],
  customerOrders: [],
  vehicleOrders: [],
  invoiceURL: "",
  inspectionURL: "",
  technicianOrders: [],
  data: [],
  isPdfLoading: false,
  isOrderLoading: true
};

export const orderReducer = handleActions(
  {
    [orderActions.GET_ORDER_ID_SUCCESS]: (state, { payload }) => ({
      ...state,
      ...payload
    }),
    [orderActions.ADD_ORDER_REQUEST]: (state, { payload }) => ({
      ...state,
      ...payload
    }),
    [orderActions.ADD_ORDER_SUCCESS]: (state, { payload }) => ({
      ...state,
      ...payload,
      orderItems: payload.result
    }),
    [orderActions.GET_ORDER_LIST_SUCCESS]: (state, { payload }) => ({
      ...state,
      orderData: {
        isLoading: false,
        totalOrders: payload.totalOrders,
        orders: payload.data
      },
      orderStatus: payload.orderStatus
    }),
    [orderActions.UPDATE_ORDER_DETAILS]: (state, { payload }) => ({
      ...state,
      isLoading: !payload.isPdfGenerated ? true : false,
      isPdfLoading: payload.isPdfLoading ? true : false
    }),
    [orderActions.UPDATE_ORDER_DETAILS_SUCCESS]: (state, { payload }) => ({
      ...state,
      isLoading: false
    }),
    [orderActions.GET_ORDER_DETAILS_REQUEST]: (state, { payload }) => ({
      ...state,
      isOrderLoading: payload.isAuthStatus ? false : true
    }),
    [orderActions.GET_ORDER_DETAILS_SUCCESS]: (state, { payload }) => ({
      ...state,
      orderItems: payload.order ? payload.order : null,
      orderId: payload.orderId,
      customerOrders: payload.customerOrders,
      vehicleOrders: payload.vehicleOrders,
      isOrderLoading: false
    }),
    [orderActions.UPDATE_ORDER_STATUS_NAME_SUCC]: (state, { payload }) => ({
      ...state,
      ...payload
    }),
    [serviceActions.GET_ALL_SERVICE_LIST_REQUEST]: (state, { payload }) => ({
      ...state,
      technicianOrders: [],
      isOrderLoading: true
    }),
    [serviceActions.GET_ALL_SERVICE_LIST_SUCCESS]: (state, { payload }) => ({
      ...state,
      technicianOrders: payload,
      isOrderLoading: false
    }),
    [serviceActions.UPDATE_ORDER_SERVICE_DATA]: (state, { payload }) => ({
      ...state,
      orderItems: {
        ...state.orderItems,
        serviceId: payload
      },
    }),
  },
  initialState
);
