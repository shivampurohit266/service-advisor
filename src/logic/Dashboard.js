import { createLogic } from "redux-logic";
import {
  dashboardActions,
  getDashboardOverviewSuccess,
  getDashboardCustomerSaleSuccess,
  getDashboardAppointmentsSuccess
} from "../actions";
import { logger, ApiHelper } from "../helpers";
/**
 *
 */
const getOverviewLogic = createLogic({
  type: dashboardActions.GET_DASHBOARD_OVERVIEW,
  async process({ getState }, dispatch, done) {
    const result = await new ApiHelper().FetchFromServer(
      "/dashboard",
      "/overview",
      "GET",
      true
    );
    logger(result);
    const oldState = getState().dashboardReducer;
    dispatch(
      getDashboardOverviewSuccess(
        result.isError ? oldState.overview : result.data.data
      )
    );
    done();
  }
});
/**
 *
 */
const getCustomerSalesLogic = createLogic({
  type: dashboardActions.GET_DASHBOARD_CUSTOMER_SALE,
  async process({ action }, dispatch, done) {
    const result = await new ApiHelper().FetchFromServer(
      "/dashboard",
      "/customers-sales",
      "GET",
      true,
      action.payload
    );
    logger(result);
    dispatch(
      getDashboardCustomerSaleSuccess({
        ...result.data.data
      })
    );
    done();
  }
});
/**
 *
 */
const getAppointmentsLogic = createLogic({
  type: dashboardActions.GET_DASHBOARD_APPOINTMENTS,
  async process({ action }, dispatch, done) {
    const result = await new ApiHelper().FetchFromServer(
      "/dashboard",
      "/appointments",
      "GET",
      true,
      action.payload
    );
    logger(result);
    dispatch(
      getDashboardAppointmentsSuccess({
        data: result.data.data
      })
    );
    done();
  }
});
/**
 *
 */
export const DashboardLogics = [
  getOverviewLogic,
  getCustomerSalesLogic,
  getAppointmentsLogic
];
