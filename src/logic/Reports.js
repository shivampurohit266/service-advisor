import { createLogic } from "redux-logic";
import { ReportActions, updateCustomerReportData } from "../actions";
import { logger, ApiHelper } from "../helpers";
import { AppConfig } from "../config/AppConfig";

const getCustomerInvoiceReportLogic = createLogic({
  type: ReportActions.GET_CUSTOMER_INVOICE_REPORTS,
  async process({ action }, dispatch, done) {
    logger(action.payload);
    dispatch(
      updateCustomerReportData({
        isLoading: true,
        data: []
      })
    );
    const result = await new ApiHelper().FetchFromServer(
      "/reports",
      "",
      "GET",
      true,
      {
        ...action.payload,
        limit: AppConfig.ITEMS_PER_PAGE * 2
      },
    );
    logger(result);
    if (result.isError) {
      dispatch(
        updateCustomerReportData({
          isLoading: false,
          data: []
        })
      );
      done();
      return;
    }
    dispatch(
      updateCustomerReportData({
        isLoading: false,
        data: result.data.data,
        totalReports: result.data.totalReports
      })
    );
    done();
  }
});

/**
 *
 */
export const ReportLogics = [getCustomerInvoiceReportLogic];
