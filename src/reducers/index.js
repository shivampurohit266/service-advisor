import { combineReducers } from "redux";
import { handleActions } from "redux-actions";
import { routerReducer } from "react-router-redux";

import { customerInfoReducer, customerListReducer } from "./Customer";
import { fleetReducer } from "./FleetList";
import { inspectionReducer } from "./Inspection";
import { inventoryPartsReducers } from "./InventoryParts";
import { inventoryStatsReducer } from "./InventorySats";
import { labelReducer } from "./Label";
import { labourReducer } from "./Labours";
import { matrixListReducer } from "./MatrixList";
import { modelInfoReducer } from "./ModelOperation";
import { orderReducer } from "./Order";
import { profileInfoReducer } from "./ProfileInfo";
import { rateStandardListReducer } from "./RateStandard";
import { serviceReducers } from "./Service";
import { tiresReducer } from "./Tires";
import { usersReducer } from "./Users";
import { vehicleAddInfoReducer, vehicleListReducer } from "./Vehicles";
import { vendorsReducer } from "./Vendors";
import { timelogReducer } from "./TimeLog";
import { activityReducer } from "./Activity";
import { messageReducer } from "./Message";
import { summaryReducer } from "./OrderSummary";
import { appointmentReducer, appointmentDetailsReducer } from "./Appointments";
import { paymentReducer } from "./Payment";
import { subscriptionReducer } from "./Subscription";
import { dashboardReducer } from "./Dashboard";
import { reportReducer } from "./Reports";
import { pdfReducer } from "./Pdf";
import { homePageDetailsReducer } from "./HomePage";
import { siteSettingDetailsReducer } from "./SiteSetting";
import { faqPageReducer } from "./Faq";

export const mainReducer = handleActions(
  {
    SHOW_LOADER: (state, action) => ({
      showLoader: true
    }),
    HIDE_LOADER: (state, action) => ({
      showLoader: false
    })
  },
  {
    showLoader: false
  }
);
/**
 *
 */
const AppReducer = combineReducers({
  mainReducer,
  usersReducer,
  tiresReducer,
  profileInfoReducer,
  matrixListReducer,
  fleetReducer,
  labourReducer,
  rateStandardListReducer,
  customerInfoReducer,
  modelInfoReducer,
  customerListReducer,
  vehicleAddInfoReducer,
  vehicleListReducer,
  vendorsReducer,
  inventoryPartsReducers,
  inventoryStatsReducer,
  orderReducer,
  inspectionReducer,
  serviceReducers,
  labelReducer,
  timelogReducer,
  activityReducer,
  messageReducer,
  summaryReducer,
  appointmentReducer,
  appointmentDetailsReducer,
  paymentReducer,
  subscriptionReducer,
  dashboardReducer,
  reportReducer,
  pdfReducer,
  homePageDetailsReducer,
  siteSettingDetailsReducer,
  faqPageReducer,
  routing: routerReducer
});

export default AppReducer;
