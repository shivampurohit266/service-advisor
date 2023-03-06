import { handleActions } from "redux-actions";
import { PdfActions } from "../actions";

const initialState = {
  invoiceUrl: "",
  inspectionUrl: "",
  isSuccess: false
};

export const pdfReducer = handleActions(
  {
    [PdfActions.GENRATE_INVOICE]: (state, action) => ({
      ...state,
      invoiceUrl: "",
      isSuccess: false
    }),
    [PdfActions.GENRATE_INVOICE_SUCCESS]: (state, action) => ({
      ...state,
      invoiceUrl: action.payload,
      isSuccess: true
    }),
    [PdfActions.GENRATE_INSPECTION_SUCCESS]: (state, action) => ({
      ...state,
      inspectionUrl: action.payload,
      isSuccess: true
    })
  },
  initialState
);
