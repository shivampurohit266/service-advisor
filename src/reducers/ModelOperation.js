import { handleActions } from "redux-actions";
import { modelActions } from "./../actions";

const initialAuthState = {
  modelDetails: {
    customerModel: false,
    customerEditModel: false,
    fleetEditModel: false,
    vehicleModel: false,
    vehicleEditModel: false,
    custAndVehicle: false,
    custAndVehicleCustomer: false,
    custAndVehicleVehicle: false,
    addUserModal: false,
    editUserModal: false,
    tireAddModalOpen: false,
    tireEditModalOpen: false,
    vendorAddModalOpen: false,
    vendorEditModalOpen: false,
    partAddModalOpen: false,
    rateAddModalOpen: false,
    partEditModalOpen: false,
    showImportModal: false,
    matrixAddModalOpen: false,
    matrixEditModalOpen: false,
    addOrderStatusModalOpen: false,
    timeClockModalOpen: false,
    timeClockEditModalOpen: false,
    paymentModalOpen: false,
    showAddAppointmentModal: false,
    showAppointmentDetailModal: false,
    showAddAppointmentModalHeader: false,
    openSubscriptionModel: false,
    openSubPayementModel: false,
    openSubscriptionUpdateModel: false,
    openSubUpgradeModel: false,
    enquiryModalOpen: false
  }
};

export const modelInfoReducer = handleActions(
  {
    [modelActions.MODEL_OPEN_REQUEST]: (state, action) => ({
      ...state,
      modelDetails: {
        ...state.modelDetails,
        ...action.payload.modelDetails
      }
    }),
    [modelActions.MODEL_CLOSE_REQUEST]: (state, action) => ({
      ...state,
      modelDetails: {
        ...state.modelDetails,
        ...action.payload.modelDetails
      }
    })
  },
  initialAuthState
);
