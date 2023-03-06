import { createAction } from "redux-actions";

export const dashboardActions = {
  GET_DASHBOARD_OVERVIEW: "Dashboard overview Requested!",
  GET_DASHBOARD_OVERVIEW_SUCCESS: "Dashboard overview  success!",
  GET_DASHBOARD_CUSTOMER_SALE: "Dashboard customer sales Requested!",
  GET_DASHBOARD_CUSTOMER_SALE_SUCCESS: "Dashboard customer sales  success!",
  GET_DASHBOARD_APPOINTMENTS: "Dashboard dashboard appointments Requested!",
  GET_DASHBOARD_APPOINTMENTS_SUCCESS:
    "Dashboard dashboard appointments success!"
};

export const getDashboardOverview = createAction(
  dashboardActions.GET_DASHBOARD_OVERVIEW
);
export const getDashboardOverviewSuccess = createAction(
  dashboardActions.GET_DASHBOARD_OVERVIEW_SUCCESS
);
/**
 *
 */
export const getDashboardCustomerSale = createAction(
  dashboardActions.GET_DASHBOARD_CUSTOMER_SALE
);
export const getDashboardCustomerSaleSuccess = createAction(
  dashboardActions.GET_DASHBOARD_CUSTOMER_SALE_SUCCESS
);
/**
 *
 */
export const getDashboardAppointments = createAction(
  dashboardActions.GET_DASHBOARD_APPOINTMENTS
);
export const getDashboardAppointmentsSuccess = createAction(
  dashboardActions.GET_DASHBOARD_APPOINTMENTS_SUCCESS
);
