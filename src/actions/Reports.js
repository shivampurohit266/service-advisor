import { createAction } from "redux-actions";
/**
 *
 */
export const ReportActions = {
  GET_CUSTOMER_INVOICE_REPORTS: "Get Customer Inoive Report!",
  UPDATE_CUSTOMER_INVOICE_REPORTS: "Update Customer Inoive Report!"
};
/**
 *
 */
export const getCustomerInoiveReport = createAction(
  ReportActions.GET_CUSTOMER_INVOICE_REPORTS
);

export const updateCustomerReportData = createAction(
  ReportActions.UPDATE_CUSTOMER_INVOICE_REPORTS
);
