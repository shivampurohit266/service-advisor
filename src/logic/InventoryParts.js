import { createLogic } from "redux-logic";
import {
  inventoryPartsActions,
  modelOpenRequest,
  showLoader,
  hideLoader,
  getInventoryPartsListStarted,
  getInventoryPartsListSuccess,
  getInventoryPartsList,
  addPartToService
} from "./../actions";
import { logger } from "../helpers/Logger";
import { ApiHelper } from "../helpers/ApiHelper";
import { toast } from "react-toastify";
import { DefaultErrorMessage } from "../config/Constants";
import { AppConfig } from "../config/AppConfig";

let toastId = null;
let lastReq;
const getInventoryPartsVendorLogic = createLogic({
  type: inventoryPartsActions.GET_VENDORS_LIST,
  async process({ action, getState }, dispatch, done) {
    if (lastReq) {
      lastReq.cancelRequest();
    }
    lastReq = new ApiHelper();
    let result = await lastReq.FetchFromServer(
      "/vendor",
      "/vendorList",
      "GET",
      true,
      { search: action.payload.input }
    );
    logger(result);
    if (result.isError) {
      done();
      return;
    }
    const options = result.data.data.map(vendor => ({
      label: vendor.name,
      value: vendor._id
    }));
    action.payload.callback(options);
    done();
  }
});

const addPartToInventoryLogic = createLogic({
  type: inventoryPartsActions.ADD_PART_TO_INVENTORY,
  async process({ action, getState }, dispatch, done) {
    const { data, query } = action.payload;
    logger(action.payload)
    dispatch(showLoader());
    const api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/inventory",
      "/part",
      "POST",
      true,
      undefined,
      data
    );
    logger(result);
    if (result.isError) {
      if (!toast.isActive(toastId)) {
        toastId = toast.error(
           result.messages[0] || DefaultErrorMessage
        );
     }
      dispatch(hideLoader());
      done();
      return;
    }
    if (!toast.isActive(toastId)) {
      toastId = toast.success(
         result.messages[0]
      );
   }
    if (data.serviceModal) {
      logger(data.services, data.services[data.serviceIndex], "!###########221233")
      let servicePartData = data.services[data.serviceIndex].serviceItems
      servicePartData.push({
        ...result.data.result,
        qty: 1,
        serviceType: "Part",
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
      dispatch(addPartToService({
        services: data.services,
        serviceIndex: data.serviceIndex
      }
      ))
      dispatch(
        modelOpenRequest({
          modelDetails: {
            partAddModalOpen: false
          }
        })
      );
      dispatch(hideLoader());
      done();
    } else {
      dispatch(
        modelOpenRequest({
          modelDetails: {
            partAddModalOpen: false
          }
        })
      );
      dispatch(hideLoader());
      dispatch(
        getInventoryPartsList({
          ...query
        })
      );
      done();
    }
  }
});

const getInventoryPartsListLogic = createLogic({
  type: inventoryPartsActions.GET_PARTS_LIST,
  async process({ action, getState }, dispatch, done) {
    dispatch(getInventoryPartsListStarted());
    const api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/inventory",
      "/part",
      "GET",
      true,
      {
        search: action.payload && action.payload.input ? action.payload.input : action.payload && action.payload.search ? action.payload.search : null,
        sort: action.payload && action.payload.sort ? action.payload.sort : null,
        status: action.payload && action.payload.status ? action.payload.status : null,
        type: action.payload && action.payload.type ? action.payload.type : null,
        vendorId: action.payload && action.payload.vendorId ? action.payload.vendorId : null,
        limit: AppConfig.ITEMS_PER_PAGE,
        page: action.payload && action.payload.page ? action.payload.page : null
      }
    );
    if (result.isError) {
      dispatch(
        getInventoryPartsListSuccess({
          parts: [],
          total: 0
        })
      );
      done();
      return;
    }
    if (action.payload.page > 1 && !result.data.parts.length) {
      dispatch(
        getInventoryPartsList({
          ...action.payload,
          page: action.payload.page - 1
        })
      );
    } else {
      var defaultOptions = [
        {
          value: "",
          label: "Add New Part"
        }
      ];
      const options = result.data.parts.map(part => ({
        label: `${part.description}`,
        value: part._id,
        partData: {
          ...part,
          qty: 1,
          serviceType: 'part',
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
      dispatch(getInventoryPartsListSuccess(result.data));
    }
    done();
  }
});

const deletePartFromInventoryLogic = createLogic({
  type: inventoryPartsActions.DELETE_PART_FROM_INVENTORY,
  async process({ action, getState }, dispatch, done) {
    const { parts, totalParts } = getState().inventoryPartsReducers;
    const { parts: partsToDelete, query } = action.payload;
    dispatch(getInventoryPartsListStarted());
    const api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/inventory",
      "/part",
      "DELETE",
      true,
      undefined,
      partsToDelete
    );
    if (result.isError) {
      if (!toast.isActive(toastId)) {
        toastId = toast.error(
           result.messages[0] || DefaultErrorMessage
        );
     }
      dispatch(getInventoryPartsListSuccess({ parts, totalParts }));
      done();
      return;
    }
    toast.success(result.messages[0]);
    dispatch(getInventoryPartsList({ ...query }));
    done();
  }
});

const updatePartToInventoryLogic = createLogic({
  type: inventoryPartsActions.UPDATE_PART_TO_INVENTORY,
  async process({ action, getState }, dispatch, done) {
    const { data, query } = action.payload;
    dispatch(showLoader());
    const api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/inventory",
      "/part",
      "PUT",
      true,
      undefined,
      data
    );
    logger(result);
    if (result.isError) {
      if (!toast.isActive(toastId)) {
        toastId = toast.error(
           result.messages[0] || DefaultErrorMessage
        );
     }
      dispatch(hideLoader());
      done();
      return;
    }
    if (!toast.isActive(toastId)) {
      toastId = toast.success(
         result.messages[0]
      );
   }
    dispatch(
      modelOpenRequest({
        modelDetails: {
          partEditModalOpen: false
        }
      })
    );
    dispatch(hideLoader());
    dispatch(
      getInventoryPartsList({
        ...query
      })
    );
    done();
  }
});
export const InventoryPartsLogic = [
  getInventoryPartsVendorLogic,
  addPartToInventoryLogic,
  getInventoryPartsListLogic,
  deletePartFromInventoryLogic,
  updatePartToInventoryLogic
];
