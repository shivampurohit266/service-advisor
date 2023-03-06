import { createAction } from "redux-actions";

export const PdfActions = {
  GENRATE_INVOICE: "Genrate Invoice Requested!",
  GENRATE_INVOICE_SUCCESS: "Genrate Invoice Success!",
  GENRATE_INSPECTION_SUCCESS: "Genrate Inspection Success!"
};

export const genrateInvoice = createAction(PdfActions.GENRATE_INVOICE);
export const genrateInvoiceSuccess = createAction(
  PdfActions.GENRATE_INVOICE_SUCCESS
);
export const genrateInspectionSuccess = createAction(
  PdfActions.GENRATE_INSPECTION_SUCCESS
);
