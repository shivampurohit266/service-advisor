import { createLogic } from "redux-logic";
import {
  appointmentActions,
  showLoader,
  hideLoader,
  getAppointments,
  getAppointmentsSuccess,
  getTechnicianAppoitmentSuccess,
  getVehicleAppoitmentSuccess,
  modelOpenRequest,
  getAppointmentDetailsSuccess,
} from "../actions";
import { ApiHelper } from "../helpers";
import { toast } from "react-toastify";
import { DefaultErrorMessage } from "../config/Constants";

let toastId = null;
/**
 *
 */
const getAppointmentLogic = createLogic({
  type: appointmentActions.GET_APPOINTMENT_LIST,
  async process({ action }, dispatch, done) {
    const { payload } = action;
    const api = new ApiHelper();
    const result = await api.FetchFromServer(
      "/appointment",
      "/",
      "GET",
      true,
      payload
    );
    if (result.isError) {
      if (!toast.isActive(toastId)) {
        toastId = toast.error(
          result.messages[0] || DefaultErrorMessage
        );
      }
      dispatch(
        getAppointmentsSuccess({
          data: []
        })
      );
      done();
      return;
    } else {
      if (action.payload.technicianId) {
        dispatch(getTechnicianAppoitmentSuccess(result.data.data));
      } else if (action.payload.vehicleId) {
        dispatch(
          getVehicleAppoitmentSuccess({
            vehicleAppoitment: result.data.data
          })
        );
      } else {
        dispatch(
          getAppointmentsSuccess({
            data: result.data.data
          })
        );
      }
      done();
    }
  }
});
/**
 *
 */
const addAppointmentLogic = createLogic({
  type: appointmentActions.ADD_APPOINTMENT_REQUEST,
  async process({ action }, dispatch, done) {
    const { payload } = action;
    dispatch(showLoader());
    const api = new ApiHelper();
    const result = await api.FetchFromServer(
      "/appointment",
      "/",
      "POST",
      true,
      undefined,
      payload
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
    }
    if (!toast.isActive(toastId)) {
      toastId = toast.success(
        result.messages[0]
      );
    }
    dispatch(getAppointments({ technicianId: null, vehicleId: null }));
    dispatch(
      modelOpenRequest({
        modelDetails: {
          showAddAppointmentModal: false
        }
      })
    );
    dispatch(hideLoader());
    done();
  }
});
/**
 *
 */
/**
 *
 */
const udpateAppointmentLogic = createLogic({
  type: appointmentActions.UPDATE_APPOINTMENT_REQUEST,
  async process({ action }, dispatch, done) {
    const { payload } = action;
    dispatch(showLoader());
    const api = new ApiHelper();
    const result = await api.FetchFromServer(
      "/appointment",
      "/" + payload.id,
      "PUT",
      true,
      undefined,
      payload.data
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
    }
    if (!toast.isActive(toastId)) {
      toastId = toast.success(
        result.messages[0]
      );
    }
    dispatch(getAppointments({ technicianId: null, vehicleId: null }));
    dispatch(
      modelOpenRequest({
        modelDetails: {
          showAddAppointmentModal: false
        }
      })
    );
    dispatch(hideLoader());
    done();
  }
});

/**
 *
 */
const getAppointmentDetailsLogic = createLogic({
  type: appointmentActions.GET_APPOINTMENT_DETAILS_REQUEST,
  async process({ action }, dispatch, done) {
    const { payload } = action;
    const { eventId } = payload;
    const api = new ApiHelper();
    const result = await api.FetchFromServer(
      "/appointment",
      `/${eventId}`,
      "GET",
      true
    );
    if (!result.isError) {
      dispatch(getAppointmentDetailsSuccess({ data: result.data.data }));
    }
    done();
  }
});
/**
 *
 */
export const AppointmentLogics = [
  addAppointmentLogic,
  getAppointmentLogic,
  getAppointmentDetailsLogic,
  udpateAppointmentLogic
];
