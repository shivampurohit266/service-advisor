// import { push } from "react-router-redux";
import { createLogic } from "redux-logic";
import { toast } from "react-toastify";
import { ApiHelper } from "../helpers/ApiHelper";
import { logger } from "../helpers/Logger";
import {
  showLoader,
  hideLoader,
  vehicleActions,
  vehicleAddSuccess,
  // vehicleAddFailed,
  modelOpenRequest,
  vehicleGetStarted,
  vehicleGetSuccess,
  vehicleGetFailed,
  vehicleGetRequest,
  vehicleEditSuccess,
  customerAddStarted,
  redirectTo,
  updateImportVehicleReq,
  customerGetRequest,
} from "./../actions";
import { DefaultErrorMessage } from "../config/Constants";
import { AppRoutes } from "../config/AppRoutes";
import XLSX from "xlsx";
import { AppConfig } from "../config/AppConfig";
import { VehiclesData } from "../config/Constants";
import { ColorOptions, groupedOptions } from "../config/Color";
import { Transmission, Drivetrain } from "../config/Constants";
let toastId = null;

const vehicleAddLogic = createLogic({
  type: vehicleActions.VEHICLES_ADD_REQUEST,
  cancelType: vehicleActions.VEHICLES_ADD_FAILED,
  async process({ getState, action }, dispatch, done) {
    const profileStateData = getState().profileInfoReducer;
    let data = action.payload;
    data.parentId = profileStateData.profileInfo.parentId;
    data.userId = profileStateData.profileInfo._id;
    if (profileStateData.profileInfo.parentId === null) {
      data.parentId = profileStateData.profileInfo._id;
    }
    dispatch(showLoader());
    dispatch(
      vehicleAddSuccess({
        vehicleAddInfo: {}
      })
    );
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/vehicle",
      "/addVehicle",
      "POST",
      true,
      undefined,
      action.payload
    );
    if (result.isError) {
      if (!toast.isActive(toastId)) {
        toastId = toast.error(result.messages[0] || result.messages);
      }
      dispatch(
        vehicleAddSuccess({
          vehicleAddInfo: {},
          isLoading: false
        })
      );
      dispatch(hideLoader());
      // localStorage.removeItem("token");
      // dispatch(push("/login"));
      done();
      return;
    } else {
      if (!toast.isActive(toastId)) {
        toastId = toast.success(result.messages[0]);
      }
      if (action.payload.workFlowVehicle) {
        dispatch(
          vehicleAddSuccess({
            vehicleAddInfo: result.data.data
          })
        );
      }
      dispatch(hideLoader());
      if (data.isCustomerDetails) {
        dispatch(customerGetRequest());
      }
      if (action.payload.isSingleCustomer) {
        dispatch(customerGetRequest({ customerId: action.payload.customerId }));
      }
      dispatch(
        modelOpenRequest({
          modelDetails: {
            vehicleModel: false,
            custAndVehicleCustomer: false,
            custAndVehicleVehicle: false,
            custAndVehicle: false
          }
        })
      );
      dispatch(vehicleGetRequest());
      done();
    }
  }
});

const getVehiclesLogic = createLogic({
  type: vehicleActions.VEHICLES_GET_REQUEST,
  async process({ action }, dispatch, done) {
    dispatch(
      vehicleGetStarted({
        isLoading: true,
        vehicleList: []
      })
    );
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/vehicle",
      "/getAllVehicleList",
      "GET",
      true,
      {
        search:
          action.payload && action.payload.input
            ? action.payload.input
            : action.payload && action.payload.search
              ? action.payload.search
              : null,
        sort:
          action.payload && action.payload.sort ? action.payload.sort : null,
        limit: action.payload && action.payload.limit ? action.payload.limit : AppConfig.ITEMS_PER_PAGE,
        vehicleId:
          action.payload &&
            action.payload.vehicleId &&
            action.payload.isGetVehicle
            ? action.payload.vehicleId
            : null,
        page: action.payload && action.payload.page ? action.payload.page : null
      }
    );
    if (result.isError) {
      dispatch(
        vehicleGetFailed({
          isLoading: false,
          vehicleList: []
        })
      );
      dispatch(hideLoader());
      done();
      return;
    } else {
      var defaultOptions = [
        {
          label: "+ Add New Vehicle",
          value: ""
        }
      ];
      const options = result.data.data.map(vehicle => ({
        label: `${vehicle.make} ${vehicle.modal}`,
        value: vehicle._id,
        data: vehicle
      }));
      let allVehicle;
      allVehicle = [
        {
          label: "All Vehicles",
          value: "",
          isDisabled: true
        }
      ];
      logger(
        action.payload && action.payload.callback
          ? action.payload.callback(
            options.length
              ? allVehicle.concat(options.concat(defaultOptions))
              : defaultOptions
          )
          : null
      );
      dispatch(hideLoader());
      dispatch(
        vehicleGetSuccess({
          isLoading: false,
          vehicleList: result.data.data,
          totalVehicles: result.data.totalVehicles
        })
      );
      dispatch(customerAddStarted({}));
      done();
    }
  }
});

const editCustomerLogic = createLogic({
  type: vehicleActions.EDIT_VEHICLE_REQUESTED,
  async process({ action }, dispatch, done) {
    dispatch(showLoader());
    logger(action.payload);
    let data = {
      data: action.payload
    };
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/vehicle",
      "/updateVehicleDetails",
      "PUT",
      true,
      undefined,
      data
    );
    if (result.isError) {
      if (!toast.isActive(toastId)) {
        toastId = toast.error(result.messages[0] || DefaultErrorMessage);
      }
      dispatch(hideLoader());
      done();
      return;
    } else {
      if (!toast.isActive(toastId)) {
        toastId = toast.success(result.messages[0]);
      }
      dispatch(vehicleEditSuccess());
      dispatch(
        vehicleGetRequest({
          ...action.payload
        })
      );
      dispatch(modelOpenRequest({ modelDetails: { vehicleEditModel: false } }));
      dispatch(hideLoader());
      done();
    }
  }
});

const deleteVehicleLogic = createLogic({
  type: vehicleActions.DELETE_VEHICLE,
  async process({ action }, dispatch, done) {
    dispatch(showLoader());
    logger(action.payload);
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/vehicle",
      "/delete",
      "POST",
      true,
      undefined,
      action.payload
    );
    if (result.isError) {
      if (!toast.isActive(toastId)) {
        toastId = toast.error(result.messages[0] || DefaultErrorMessage);
      }
      dispatch(hideLoader());
      done();
      return;
    } else {
      if (!toast.isActive(toastId)) {
        toastId = toast.success(result.messages[0]);
      }
      dispatch(hideLoader());
      delete action.payload.userId;
      dispatch(
        vehicleGetRequest({
          ...action.payload
        })
      );
      done();
    }
  }
});

const updateVehicleStatusLogic = createLogic({
  type: vehicleActions.UPDATE_VEHICLE_STATUS,
  async process({ action }, dispatch, done) {
    dispatch(showLoader());
    logger(action.payload);
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/vehicle",
      "/updateStatus",
      "POST",
      true,
      undefined,
      action.payload
    );
    if (result.isError) {
      if (!toast.isActive(toastId)) {
        toastId = toast.error(result.messages[0] || DefaultErrorMessage);
      }
      dispatch(hideLoader());
      done();
      return;
    } else {
      if (!toast.isActive(toastId)) {
        toastId = toast.success(result.messages[0]);
      }
      dispatch(hideLoader());
      delete action.payload.vehicles;
      delete action.payload.status;
      dispatch(
        vehicleGetRequest({
          ...action.payload
        })
      );
      done();
    }
  }
});
const importVehicleLogic = createLogic({
  type: vehicleActions.IMPORT_VEHICLE_REQUEST,
  async process({ action, getState }, dispatch, done) {
    dispatch(showLoader());
    logger(action.payload);
    if (!action.payload.length) {
      toast.error(`No data found in sheet.`);
      dispatch(hideLoader());
      done();
      return;
    }
    dispatch(
      updateImportVehicleReq({
        importError: null
      })
    );
    const profileStateData = getState().profileInfoReducer;
    logger(profileStateData);
    const errroredRows = [];
    let hasError = false;
    const current_year = new Date().getFullYear();
    const data = action.payload.map(element => {
      if (!element["Year"]) {
        hasError = true;
        errroredRows.push(
          `Year not found on row <b>${element.rowNumber}</b> of <b>${element.sheetName}</b> sheet.`
        );
      } else if (
        isNaN(parseInt(element["Year"])) ||
        (element["Year"].length > 4 || element["Year"].length < 2)
      ) {
        hasError = true;
        errroredRows.push(
          `Invalid year value found on row <b>${element.rowNumber}</b> of <b>${element.sheetName}</b> sheet.`
        );
      } else if (element["Year"] <= current_year - 101 || element["Year"] > current_year) {
        hasError = true;
        errroredRows.push(
          `Year should be in range ${current_year - 101} to ${new Date().getFullYear()} on row <b>${element.rowNumber}</b> of <b>${element.sheetName}</b> sheet.`
        )

      }
      if (!element["Make"]) {
        hasError = true;
        errroredRows.push(
          `Make not found on row <b>${element.rowNumber}</b> of <b>${element.sheetName}</b> sheet.`
        );
      }
      if (!element["Model"]) {
        hasError = true;
        errroredRows.push(
          `Model number not found on row <b>${element.rowNumber}</b> of <b>${element.sheetName}</b> sheet.`
        );
      }
      if (!element["Licence Plate"] || (element["Licence Plate"] && element["Licence Plate"].length > 18)) {
        hasError = true;
        errroredRows.push(
          `Licence number not found on row <b>${element.rowNumber}</b> of <b>${element.sheetName}</b> sheet.`
        );
      }
      if (element["Miles"] && element["Miles"] !== "") {
        if (isNaN(parseInt(element["Miles"])) || (element["Miles"].length > 15)) {
          hasError = true;
          errroredRows.push(
            `Invalid miles value found on row <b>${element.rowNumber}</b> of <b>${element.sheetName}</b> sheet.`
          );
        }
      }
      if (element["VIN"] && element["VIN"] !== "" && (element["VIN"].length) > 17) {
        hasError = true;
        errroredRows.push(
          `Invalid vin value found on row <b>${element.rowNumber}</b> of <b>${element.sheetName}</b> sheet.`
        );
      }
      if (element["Drivetrain"] && element["Drivetrain"] !== "") {
        const regex = RegExp(`^${element["Drivetrain"]}$`, 'i');
        const data = Drivetrain.filter((item) => {
          return item.key.match(regex)
        })
        if (!data) {
          hasError = true;
          errroredRows.push(
            `Invalid drivetrain value found on row <b>${element.rowNumber}</b> of <b>${element.sheetName}</b> sheet.`
          );
        }
      }
      if (element["Transmission"] && element["Transmission"] !== "") {
        const regex = RegExp(`^${element["Transmission"]}$`, 'i');
        const data = Transmission.filter((item) => {
          return item.key.match(regex)
        })
        if (!data) {
          hasError = true;
          errroredRows.push(
            `Invalid transmission value found on row <b>${element.rowNumber}</b> of <b>${element.sheetName}</b> sheet.`
          );
        }
      }
      if (element["Production Date"] && element["Production Date"] !== "") {
        const splitedDate = element["Production Date"].split("/")
        var d = new Date();
        var n = d.getFullYear();
        if (parseInt(splitedDate[0]) > 12 && splitedDate[0]) {
          hasError = true;
          errroredRows.push(
            `Invalid production date value found on row <b>${element.rowNumber}</b> of <b>${element.sheetName}</b> sheet.`
          );
        }
        else if (parseInt(splitedDate[1]) >= n && splitedDate[1]) {
          hasError = true;
          errroredRows.push(
            `Invalid production date value found on row <b>${element.rowNumber}</b> of <b>${element.sheetName}</b> sheet.`
          );
        }
      }
      return {
        year: parseInt(element["Year"]),
        make: element["Make"],
        modal: element["Model"],
        type: {
          value: element["Type"] ? element["Type"].toLowerCase() : null,
          label: element["Type"],
          color: "#00B8D9",
          isFixed: true
        },
        notes: element["Notes"],
        color: {
          color: element["Color"],
          label: element["Color"],
          value: element["Color"] ? element["Color"].toLowerCase() : null
        },
        miles: element["Miles"],
        licensePlate: element["Licence Plate"],
        unit: element["Unit #"],
        vin: element["VIN"],
        engineSize: element["Engine Size"],
        productionDate: element["Production Date"],
        transmission: element["Transmission"]
          ? element["Transmission"].toLowerCase()
          : null,
        subModal: element["Submodel"],
        drivetrain: element["Drivetrain"],
        parentId:
          profileStateData.profileInfo.parentId ||
          profileStateData.profileInfo._id,
        userId: profileStateData.profileInfo._id,
        status: true
      };
    });
    if (hasError) {
      dispatch(
        updateImportVehicleReq({
          importError: errroredRows.join(" <br /> ")
        })
      );
      dispatch(hideLoader());
      done();
      return;
    }
    const api = new ApiHelper();
    const result = await api.FetchFromServer(
      "/vehicle",
      "/bulk-add",
      "POST",
      true,
      undefined,
      data
    );
    if (!result.isError) {
      dispatch(
        modelOpenRequest({
          modelDetails: {
            showImportModal: false
          }
        })
      );
      dispatch(
        redirectTo({
          path: `${AppRoutes.VEHICLES.url}`
        })
      );
      dispatch(vehicleGetRequest());
      if (!toast.isActive(toastId)) {
        toastId = toast.success(result.messages[0]);
      }
    } else {
      if (!toast.isActive(toastId)) {
        toastId = toast.error(result.messages[0] || DefaultErrorMessage);
      }
    }
    setTimeout(
      () =>
        dispatch(
          updateImportVehicleReq({
            importError: null
          })
        ),
      8000
    );

    dispatch(hideLoader());
    done();
  }
});

/**
 *
 */
const getExportData = async (payload, data = []) => {
  let api = new ApiHelper();
  let result = await api.FetchFromServer(
    "/vehicle",
    "/getAllVehicleList",
    "GET",
    true,
    {
      ...payload,
      limit: 5001
    }
  );
  // Year	Make	Model	Submodel	Type	Miles	Color	Licence Plate	Unit #	VIN	Engine Size	Production Date	Transmission	Drivetrain	Notes

  if (!result.isError) {
    const d = result.data.data.map(res => {
      return {
        Year: res.year || "-",
        Make: res.make || "-",
        Model: res.modal || "-",
        Submodel: res.subModal || "-",
        Type: res.type.label || "-",
        Miles: res.miles || "-",
        Color: res.color.value || "-",
        "Licence Plate": res.licensePlate || "-",
        "Unit #": res.unit || "-",
        VIN: res.vin || "-",
        "Engine Size": res.engineSize || "-",
        "Production Date": res.productionDate || "-",
        Transmission: res.transmission || "-",
        Drivetrain: res.drivetrain || "-",
        Notes: res.notes || "-",
        Status: res.status ? "Active" : "Inactive"
      };
    });
    if (d.length === 5000) d.pop();
    data.push({
      name: `Vehicle List ${payload.page}`,
      data: d
    });
    if (result.data.data.length > 5000) {
      return await getExportData({ ...payload, page: payload.page + 1 }, data);
    }
  }
  return data;
};
/**
 *
 */
const exportVechicleLogic = createLogic({
  type: vehicleActions.EXPORT_VEHICLES,
  async process({ action }, dispatch, done) {
    dispatch(showLoader());
    const result = await getExportData({ ...action.payload, page: 1 });
    logger(result);
    const wb = XLSX.utils.book_new();
    result.forEach(res => {
      const ws = XLSX.utils.json_to_sheet(res.data);
      XLSX.utils.book_append_sheet(wb, ws, `${res.name}`);
      /* generate XLSX file and send to client */
    });
    XLSX.writeFile(wb, `vehicles_${Date.now()}.xlsx`);
    dispatch(hideLoader());
    done();
  }
});
/**
 * 
 */
const getVehicleMakeModalReq = createLogic({
  type: vehicleActions.GET_VEHICLE_MAKE_MODAL_REQ,
  async process({ action }, dispatch, done) {
    if (action.payload.input && action.payload.isVehicleMake) {
      const regex = RegExp(action.payload.input, 'i');
      let VehicleMake = [];
      let vehicle = [];
      if (!(action.payload.modal)) {
        vehicle = VehiclesData.filter((item) => {
          return item.make.match(regex)
        });
      } else {
        vehicle = VehiclesData.filter((item) => {
          return item.model === action.payload.modal && item.make.match(regex)
        });
      }
      function getUniqueListBy(arr, key) {
        return [...new Map(arr.map(item => [item[key], item])).values()]
      }
      vehicle = getUniqueListBy(vehicle, 'make');
      vehicle.sort((a, b) => (a['make'] || "").toString().localeCompare((b['make'] || "").toString()));
      vehicle.map((data) => {
        VehicleMake.push({
          label: data.make,
          value: data.make
        })
        return true
      })
      if (action.payload && action.payload.callback) {
        action.payload.callback(VehicleMake);
      }
    }
    done();
  }
});
/**
 * 
 */
const getVehicleModalLogic = createLogic({
  type: vehicleActions.GET_VEHICLE_MODAL_REQ,
  async process({ action }, dispatch, done) {
    if (action.payload.input) {
      let vehicleModal = [];
      const regex = RegExp(action.payload.input, 'i');
      let vehicle = [];
      if (!(action.payload.make)) {
        vehicle = VehiclesData.filter((item) => {
          return item.model.match(regex)
        });
      } else {
        vehicle = VehiclesData.filter((item) => {
          return item.make === action.payload.make && item.model.match(regex)
        });
      }
      // assign things.thing to myData for brevity
      var myData = vehicle;
      vehicle = Array.from(new Set(myData.map(JSON.stringify))).map(JSON.parse);
      vehicle.sort((a, b) => (a['model'] || "").toString().localeCompare((b['model'] || "").toString()));
      vehicle.map((data) => {
        vehicleModal.push({
          label: data.model,
          value: data.model
        })
        return true
      })
      if (action.payload && action.payload.callback) {
        action.payload.callback(vehicleModal);
      }
    }
    done();
  }
})
export const VehicleLogic = [
  vehicleAddLogic,
  getVehiclesLogic,
  editCustomerLogic,
  deleteVehicleLogic,
  updateVehicleStatusLogic,
  importVehicleLogic,
  exportVechicleLogic,
  getVehicleMakeModalReq,
  getVehicleModalLogic
];
