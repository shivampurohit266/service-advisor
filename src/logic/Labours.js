import { createLogic } from "redux-logic";
import {
  labourAddStarted,
  labourActions,
  labourAddSuccess,
  modelOpenRequest,
  hideLoader,
  showLoader,
  labourListStarted,
  labourListSuccess,
  labourListRequest,
  addLaborToService
} from "./../actions";
import { ApiHelper } from "../helpers/ApiHelper";
import { toast } from "react-toastify";
import { logger } from "../helpers/Logger";
import { AppConfig } from "../config/AppConfig";

let toastId = null ;
const labourAddLogic = createLogic({
  type: labourActions.LABOUR_ADD_REQUEST,
  async process({ action }, dispatch, done) {
    dispatch(
      labourAddStarted({
        labourData: []
      }),
      showLoader()
    );
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/labour",
      "/addlabour",
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
      dispatch(hideLoader());
      done();
      return;
    } else {
      const data = action.payload
      if (data.serviceLaborModal) {
        let servicePartData = data.services[data.serviceIndex].serviceItems
        servicePartData.push({
          ...result.data.laborData,
          serviceType: "labor",
          qty: 1,
          discount: {
            value: '',
            type: "%"
          },
          label: [{
            color: "",
            name: "",
            isAddLabel: false
          }],
          subTotalValue: "",
          isItemChecked: true,
          unchangebleTotal: 0.00
        })
        dispatch(addLaborToService({
          services: data.services,
          serviceIndex: data.serviceIndex
        }))
        dispatch(
          modelOpenRequest({
            modelDetails: {
              tireAddModalOpen: false
            }
          })
        );
        dispatch(hideLoader());
        done();
      } else {
        if (!toast.isActive(toastId)) {
          toastId = toast.success(
             result.messages[0]
          );
       }
        dispatch(hideLoader());
        dispatch(modelOpenRequest({ modelDetails: { tireAddModalOpen: false } }));
        dispatch(labourListRequest({
          ...action.payload,
        }));
        dispatch(labourAddSuccess({ labourData: result.data }));
        done();
      }
    }
  }
});

const labourListLogic = createLogic({
  type: labourActions.LABOUR_LIST_REQUEST,
  async process({ action }, dispatch, done) {
    dispatch(
      labourListStarted({
        labourData: [],
        isLoading: true
      }),
      showLoader()
    );
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/labour",
      "/labourList",
      "GET",
      true,
      {
        search: action.payload && action.payload.input ? action.payload.input : action.payload && action.payload.search ? action.payload.search : null,
        sort: action.payload && action.payload.sort ? action.payload.sort : null,
        limit: AppConfig.ITEMS_PER_PAGE,
        page: action.payload && action.payload.page ? action.payload.page : null
      },
      undefined,
    );
    if (result.isError) {
      if (!toast.isActive(toastId)) {
        toastId = toast.error(
           result.messages[0]
        );
     }
      dispatch(hideLoader());
      done();
      return;
    } else {
      var defaultOptions = [
        {
          value: "",
          label: "+ Add New Labor"
        },
      ];
      const options = result.data.data.map(labor => ({
        label:
          `${labor.discription} ${labor.hours}hrs $${labor.rate ? labor.rate.hourlyRate : 0}`,
        value: labor._id,
        laborData: {
          ...labor,
          serviceType: 'labor',
          discount: {
            value: '',
            type: "%"
          },
          label: [{
            color: "",
            name: "",
            isAddLabel: false
          }],
          subTotalValue: "",
          isItemChecked: true,
          unchangebleTotal: 0.00
        }
      }));
      logger(action.payload && action.payload.callback ? action.payload.callback(defaultOptions.concat(options)) : null)
      dispatch(
        labourListSuccess({
          labourData: result.data,
          isLoading: false
        }),
        hideLoader(),
      );
      done();
    }
  }
});

const editLabourLogic = createLogic({
  type: labourActions.EDIT_LABOUR_REQUESTED,
  async process({ action }, dispatch, done) {
    dispatch(showLoader());
    logger(action.payload);
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/labour",
      "/updateLabour",
      "PUT",
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
      dispatch(hideLoader());
      done();
      return;
    } else {
      if (!toast.isActive(toastId)) {
        toastId = toast.success(
           result.messages[0]
        );
     }
      dispatch(hideLoader());
      dispatch(
        modelOpenRequest({ modelDetails: { tireEditModalOpen: false } })
      )
      dispatch(labourListRequest({
        ...action.payload,
      }));
      done();
    }
  },
});

const deleteLabourLogic = createLogic({
  type: labourActions.DELETE_LABOUR,
  async process({ action }, dispatch, done) {
    dispatch(showLoader());
    logger(action.payload);
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/labour",
      "/delete",
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
      dispatch(hideLoader());
      done();
      return;
    } else {
      toast.success(result.messages[0]);
      dispatch(hideLoader());
      delete action.payload.labourId;
      dispatch(
        labourListRequest({
          ...action.payload,
        })
      );
      done();
    }
  },
});
export const LaboursLogic = [
  labourAddLogic,
  labourListLogic,
  editLabourLogic,
  deleteLabourLogic
];
