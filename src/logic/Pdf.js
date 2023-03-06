import { toast } from "react-toastify";
import { createLogic } from "redux-logic";
import { ApiHelper } from "../helpers/ApiHelper";
//import { logger } from "../helpers/Logger";
import { PdfActions, updateOrderDetailsRequest } from "../actions";
let toastId = null ;
const genrateInvoiceLogic = createLogic({
  type: PdfActions.GENRATE_INVOICE,
  async process({ action }, dispatch, done) {
    dispatch(
      updateOrderDetailsRequest({
        _id: action.payload._id,
        inspectionURL: "",
        isPdfGenerated: true,
        inspectionPdf: true,
        isPdfLoading: true
      })
    );
    let api = new ApiHelper();

    let result = await api.FetchFromServer(
      "/inspection",
      "/generatePdfDoc",
      "POST",
      true,
      undefined,
      action.payload
    );
    if (result.isError) {
      if (!toast.isActive(toastId)) {
        toastId = toast.error(
           result.messages[0]
        );
     }
      done();
      return;
    } else {
      // toast.success(result.messages[0]);
      if (action.payload.isInspection) {
        dispatch(
          updateOrderDetailsRequest({
            _id: action.payload._id,
            inspectionURL: result.data.data,
            isPdfGenerated: true,
            isPdfLoading: false,
            inspectionPdf: true
          })
        );
      } else {
        dispatch(
          updateOrderDetailsRequest({
            _id: action.payload._id,
            invoiceURL: result.data.data,
            isPdfLoading: false,
            isPdfGenerated: true
          })
        );
      }
    }
    done();
  }
});

export const PdfLogic = [genrateInvoiceLogic];
