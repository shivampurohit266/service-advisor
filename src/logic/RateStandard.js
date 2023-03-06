import { createLogic } from "redux-logic";
import { ApiHelper } from "../helpers/ApiHelper";
import { toast } from "react-toastify";
import {
  rateStandardListActions,
  getRateStandardListStart,
  getRateStandardListFail,
  getRateStandardListSuccess,
  rateAddStarted,
  hideLoader,
  showLoader,
  rateAddSuccess,
  modelOpenRequest,
  setRateStandardListStart
} from "./../actions";
import { logger } from "../helpers/Logger";

let toastId = null ;
const rateAddLogic = createLogic({
  type: rateStandardListActions.RATE_ADD_REQUEST,
  async process({ action }, dispatch, done) {
    dispatch(
      rateAddStarted({
        rateData: []
      }),
      showLoader()
    );
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/labour",
      "/addRate",
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
      if (!toast.isActive(toastId)) {
        toastId = toast.success(
           result.messages[0]
        );
     }
      dispatch(hideLoader());
      dispatch(modelOpenRequest({ modelDetails: { rateAddModalOpen: false } }));
      logger(result.data.data)
      dispatch(
        setRateStandardListStart({
          value: result.data.data._id,
          label: result.data.data.name + " - $" + result.data.data.hourlyRate
        })
      );
      dispatch(rateAddSuccess({ rateData: result.data }));
      done();
    }
  }
});


const getStandardRateListLogic = createLogic({
  type: rateStandardListActions.GET_RATE_STANDARD_LIST_REQUEST,
  cancelType: rateStandardListActions.GET_RATE_STANDARD_LIST_FAILED,
  async process({ action }, dispatch, done) {
    dispatch(
      getRateStandardListStart({
        standardRateList: []
      })
    );
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/labour",
      "/getAllStdRate",
      "get",
      true,
      {
        searchValue: action.payload && action.payload.input ? action.payload.input : null
      }
    );
    if (result.isError) {
      dispatch(
        getRateStandardListFail({
          standardRateList: []
        })
      );
    } else {
      var defaultOptions = [
        {
          value: "",
          label: "Add New Labour Rate"
        }
      ];
      let resultData = result.data.data;
      const options = resultData.map(labour => ({
        label: labour.name + " - $" + labour.hourlyRate,
        value: labour._id
      }));
      logger(action.payload && action.payload.callback ? action.payload.callback(defaultOptions.concat(options)) : null)
      dispatch(
        getRateStandardListSuccess({
          standardRateList: defaultOptions.concat(options)
        })
      );
    }
    done();
  }
});

const setStandardRateListLogic = createLogic({
  type: rateStandardListActions.SET_SELECTED_STANDARD_LIST_REQUEST,
  async process({ action, getState }, dispatch, done) {
    const rateStandardData = getState().rateStandardListReducer;
    dispatch(
      getRateStandardListSuccess({
        standardRateList: rateStandardData.standardRateList,
        selectedOptions: action.payload
      })
    );
    done();
  }
});

export const StandardRateLogic = [
  getStandardRateListLogic,
  setStandardRateListLogic,
  rateAddLogic
];
