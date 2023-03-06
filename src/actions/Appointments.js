import { createAction } from "redux-actions";

export const appointmentActions = {
  GET_APPOINTMENT_LIST: "Get Appointment list request!",
  GET_APPOINTMENT_LIST_SUCCESS: "Get Appointment list success!",
  ADD_APPOINTMENT_REQUEST: "Add Appointment Request!",
  UPDATE_APPOINTMENT_REQUEST: "Update Appointment Request!",
  GET_APPOINTMENT_DETAILS_REQUEST: "Get Appointment details Request!",
  GET_APPOINTMENT_DETAILS_SUCCESS: "Get Appointment details list success!",
  GET_TECHNICIAN_APPOITMENT_REQUEST: "Get Technician apointment request",
  GET_TECHNICIAN_APPOITMENT_SUCCESS: "Get Technician apointment success",
  GET_VEHICLE_APPOITMENT_SUCCESS: "Get Vehicle apointment success",
  GET_ORDER_APPOINTMENT_SUCCESS: "Get order Appointment Sucess"
};

export const getAppointments = createAction(
  appointmentActions.GET_APPOINTMENT_LIST
);
export const getAppointmentsSuccess = createAction(
  appointmentActions.GET_APPOINTMENT_LIST_SUCCESS
);
export const addAppointmentRequest = createAction(
  appointmentActions.ADD_APPOINTMENT_REQUEST
);
export const updateAppointmentRequest = createAction(
  appointmentActions.UPDATE_APPOINTMENT_REQUEST
);
export const getAppointmentDetails = createAction(
  appointmentActions.GET_APPOINTMENT_DETAILS_REQUEST
);
export const getAppointmentDetailsSuccess = createAction(
  appointmentActions.GET_APPOINTMENT_DETAILS_SUCCESS
);
export const getTechnicianAppoitmentRequest = createAction(
  appointmentActions.GET_TECHNICIAN_APPOITMENT_REQUEST
);
export const getTechnicianAppoitmentSuccess = createAction(
  appointmentActions.GET_TECHNICIAN_APPOITMENT_SUCCESS
);
export const getVehicleAppoitmentSuccess = createAction(
  appointmentActions.GET_VEHICLE_APPOITMENT_SUCCESS
);
export const getOrderAppointmentSuccess = createAction(
  appointmentActions.GET_ORDER_APPOINTMENT_SUCCESS
);
