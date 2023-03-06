import { toast } from "react-toastify";
import { createLogic } from "redux-logic";
import { ApiHelper } from "../helpers/ApiHelper";
import { logger } from "../helpers/Logger";
import {
  showLoader,
  hideLoader,
  customersAddActions,
  customerAddFailed,
  customerAddStarted,
  modelOpenRequest,
  customerGetStarted,
  customerGetSuccess,
  customerGetFailed,
  customerGetRequest,
  customerEditSuccess,
  customerAddSuccess,
  redirectTo,
  updateImportCustomersReq,
} from "./../actions";
import { DefaultErrorMessage } from "../config/Constants";
import { AppRoutes } from "../config/AppRoutes";
import XLSX from "xlsx";
import { AppConfig } from "../config/AppConfig";

let toastId = null;
const addCustomerLogic = createLogic({
  type: customersAddActions.CUSTOMER_ADD_REQUEST,
  cancelType: customersAddActions.CUSTOMER_ADD_FAILED,
  async process({ getState, action }, dispatch, done) {
    const profileStateData = getState().profileInfoReducer;

    let data = action.payload;
    data.parentId = profileStateData.profileInfo.parentId;
    if (profileStateData.profileInfo.parentId === null) {
      data.parentId = profileStateData.profileInfo._id;
    }

    data.userId = profileStateData.profileInfo._id;
    dispatch(showLoader());
    logger(action.payload);
    dispatch(
      customerAddStarted({
        customerAddInfo: {}
      })
    );
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/customer",
      "/createCustomer",
      "POST",
      true,
      undefined,
      data
    );
    if (result.isError) {
      dispatch(
        customerAddFailed({
          customerAddInfo: {}
        })
      );

      if (!toast.isActive(toastId)) {
        toastId = toast.error(
          result.messages[0] || DefaultErrorMessage
        );
      }
      dispatch(hideLoader());
      done();
      return;
    } else {
      if (!data.showAddVehicle) {
        if (!toast.isActive(toastId)) {
          toastId = toast.success(
            result.messages[0]
          );
        }
      } else {
        dispatch(
          modelOpenRequest({
            modelDetails: {
              custAndVehicleCustomer: false,
              custAndVehicleVehicle: true
            }
          })
        );
      }
      if (action.payload.workFlowCustomer) {
        dispatch(
          customerAddSuccess({
            customerAddInfo: { ...result.data.data, fleet: action.payload.fleet1 ? action.payload.fleet1 : null }
          })
        );
      }
      dispatch(modelOpenRequest({ modelDetails: { customerModel: false } }));
      dispatch(customerGetRequest());
      dispatch(hideLoader());
      done();
    }
  }
});

const getCustomersLogic = createLogic({
  type: customersAddActions.CUSTOMER_GET_REQUEST,
  cancelType: customersAddActions.CUSTOMER_GET_FAILED,
  async process({ action }, dispatch, done) {
    dispatch(
      customerGetStarted({
        isLoading: true,
        customers: []
      })
    );
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/customer",
      "/getAllCustomerList",
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
        status:
          action.payload && action.payload.status
            ? action.payload.status
            : null,
        limit: action.payload && action.payload.limit ? action.payload.limit : AppConfig.ITEMS_PER_PAGE,
        customerId:
          action.payload && action.payload.customerId
            ? action.payload.customerId
            : null,
        page: action.payload && action.payload.page ? action.payload.page : null
      }
    );
    if (result.isError) {
      dispatch(
        customerGetFailed({
          isLoading: false,
          customers: [],
          totalCustomers: 0
        })
      );
      done();
      return;
    } else {
      var defaultOptions = [
        { label: "All Customers", value: "", isDisabled: true }
      ];
      const options = result.data.data.map(customer => ({
        label: `${customer.firstName} ${customer.lastName}`,
        value: customer._id,
        data: customer
      }));
      logger(
        action.payload && action.payload.callback
          ? options && options.length ? action.payload.callback(defaultOptions.concat(options).concat({
            label: "+ Add New Customer",
            value: "",
          })) : action.payload.callback(options.concat({
            label: "+ Add New Customer",
            value: "",
          }))
          : null
      );
      dispatch(hideLoader());
      dispatch(
        customerGetSuccess({
          isLoading: false,
          customers: result.data.data,
          totalCustomers: result.data.totalUsers
        })
      );
      done();
    }
  }
});

const deleteCustomerLogic = createLogic({
  type: customersAddActions.DELETE_CUSTOMER,
  async process({ action }, dispatch, done) {
    dispatch(showLoader());
    logger(action.payload);
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/customer",
      "/delete",
      "POST",
      true,
      undefined,
      action.payload
    );
    if (result.isError) {
      if (!toast.isActive(toastId)) {
        toastId = toast.error(
          result.messages[0] || DefaultErrorMessage
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
      delete action.payload.userId;
      dispatch(
        customerGetRequest({
          ...action.payload.query
        })
      );
      done();
    }
  }
});

const editCustomerLogic = createLogic({
  type: customersAddActions.EDIT_CUSTOMER_REQUESTED,
  async process({ action, getState }, dispatch, done) {
    dispatch(showLoader());
    logger(action.payload);
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/customer",
      "/updateCustomerdetails",
      "PUT",
      true,
      undefined,
      { data: action.payload.data }
    );
    if (result.isError) {
      if (!toast.isActive(toastId)) {
        toastId = toast.error(
          result.messages[0] || DefaultErrorMessage
        );
      }
      dispatch(hideLoader());
      done();
      return;
    } else {
      if (!action.payload.showAddVehicle) {
        if (!toast.isActive(toastId)) {
          toastId = toast.success(
            result.messages[0]
          );
        }
      } else {
        dispatch(
          modelOpenRequest({
            modelDetails: {
              custAndVehicleCustomer: false,
              custAndVehicleVehicle: true
            }
          })
        );
      }
      const customerAddInfo = getState().customerInfoReducer && getState().customerInfoReducer.customerAddInfo ? getState().customerInfoReducer.customerAddInfo : "";
      dispatch(
        customerAddSuccess({
          customerAddInfo: { ...customerAddInfo, ...action.payload.data, fleet: action.payload.data.fleet1 ? action.payload.data.fleet1 : null }
        })
      );
      dispatch(customerEditSuccess());
      if (action.payload.data.isSingleCustomer) {
        dispatch(
          customerGetRequest({
            ...action.payload.query, customerId: action.payload.data.customerId
          })
        );
      } else {
        dispatch(
          customerGetRequest({
            ...action.payload.query
          })
        );
      }
      dispatch(
        modelOpenRequest({
          modelDetails: { customerModel: false, customerEditModel: false }
        })
      );
      dispatch(hideLoader());
      done();
    }
  }
});

const updateCustomerStatusLogic = createLogic({
  type: customersAddActions.UPDATE_CUSTOMER_STATUS,
  async process({ action }, dispatch, done) {
    dispatch(showLoader());
    logger(action.payload);
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/customer",
      "/updateStatus",
      "POST",
      true,
      undefined,
      action.payload
    );
    if (result.isError) {
      if (!toast.isActive(toastId)) {
        toastId = toast.error(
          result.messages[0] || DefaultErrorMessage
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
      delete action.payload.customers;
      delete action.payload.status;
      dispatch(
        customerGetRequest({
          ...action.payload
        })
      );
      done();
    }
  }
});
const importCustomerLogic = createLogic({
  type: customersAddActions.IMPORT_CUSTOMER_REQUEST,
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
      updateImportCustomersReq({
        importError: null
      })
    );
    const profileStateData = getState().profileInfoReducer;
    logger(profileStateData);
    const errroredRows = [];
    let hasError = false;
    const data = action.payload.map(element => {
      if (!element["First Name"]) {
        hasError = true;
        errroredRows.push(
          `First name not found on row  <b>${element.rowNumber}</b> of <b>${
          element.sheetName
          }</b> sheet.`
        );
      }
      if (!element["Phone"]) {
        hasError = true;
        errroredRows.push(
          `Phone number not found on row  <b>${element.rowNumber}</b> of <b>${
          element.sheetName
          }</b> sheet.`
        );
      }
      return {
        firstName: element["First Name"],
        lastName: element["Last Name"],
        phoneDetail: [
          { phone: element["Phone Type"], value: element["Phone"] }
        ],
        email: element["Email"],
        notes: element["Notes"],
        companyName: element["Company"],
        referralSource: element["Referral Source"],
        address1: element["Address"],
        city: element["City"],
        state: element["State"],
        zipCode: element["Zip Code"],
        // permission: {
        //   isCorporateFleetTaxExempt: {
        //     status: element["Is Tax Exempt"]
        //       ? element["Is Tax Exempt"].toLowerCase() === "yes"
        //         ? true
        //         : false
        //       : false
        //   },
        //   shouldReceiveDiscount: {
        //     status: element["Is Receive A Discount?"]
        //       ? element["Is Receive A Discount?"].toLowerCase() === "yes"
        //         ? true
        //         : false
        //       : false
        //   },
        //   shouldLaborRateOverride: { status: false, laborRate: null },
        //   shouldPricingMatrixOverride: { status: false, pricingMatrix: null }
        // },
        parentId:
          profileStateData.profileInfo.parentId ||
          profileStateData.profileInfo._id,
        userId: profileStateData.profileInfo._id,
        status: true
      };
    });
    if (hasError) {
      dispatch(
        updateImportCustomersReq({
          importError: errroredRows.join(" <br /> ")
        })
      );
      dispatch(hideLoader());
      done();
      return;
    }
    const api = new ApiHelper();
    const result = await api.FetchFromServer(
      "/customer",
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
          path: `${AppRoutes.CUSTOMERS.url}?page=1&reset=${Date.now()}`
        })
      );
      if (!toast.isActive(toastId)) {
        toastId = toast.success(
          result.messages[0]
        );
      }
    } else {
      if (!toast.isActive(toastId)) {
        toastId = toast.error(
          result.messages[0] || DefaultErrorMessage
        );
      }
    }
    setTimeout(
      () =>
        dispatch(
          updateImportCustomersReq({
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
    "/customer",
    "/getAllCustomerList",
    "GET",
    true,
    {
      ...payload,
      limit: 5001
    }
  );

  if (!result.isError) {
    const d = result.data.data.map(res => {
      return {
        "First Name": res.firstName || "-",
        "Last Name": res.lastName || "-",
        Phone: res.phoneDetail[0]
          ? res.phoneDetail.map(ph => ph.value).join(" | ")
          : "-",
        "Phone Type": res.phoneDetail[0]
          ? res.phoneDetail.map(ph => ph.phone).join(" | ")
          : "-",
        Email: res.email || "-",
        Company: res.companyName || "-",
        Address: [res.address1 || "", res.address2].join(", ") || "-",
        City: res.city || "-",
        State: res.state || "-",
        "Zip Code": res.zipCode || "-",
        Notes: res.notes || "-",
        "Refral Source": res.referralSource || "-",
        "Is Tax Exempt":
          res.permission &&
            res.permission.isCorporateFleetTaxExempt &&
            res.permission.isCorporateFleetTaxExempt.status
            ? "yes"
            : "no",
        "Is Receive A Discount":
          res.permission &&
            res.permission.shouldReceiveDiscount &&
            res.permission.shouldReceiveDiscount.status
            ? "yes"
            : "no",
        Status: res.status ? "Active" : "Inactive"
      };
    });
    if (d.length === 5000) d.pop();
    data.push({
      name: `Customer List ${payload.page}`,
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
const exportCustomerLogic = createLogic({
  type: customersAddActions.EXPORT_CUSTOMERS,
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
    XLSX.writeFile(wb, `customers_${Date.now()}.xlsx`);
    dispatch(hideLoader());
    done();
  }
});
export const CustomersLogic = [
  addCustomerLogic,
  getCustomersLogic,
  deleteCustomerLogic,
  editCustomerLogic,
  updateCustomerStatusLogic,
  importCustomerLogic,
  exportCustomerLogic
];
