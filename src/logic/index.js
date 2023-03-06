import { createLogic } from "redux-logic";
import { push } from "react-router-redux";

import { CustomersLogic } from "./Customers";
import { FleetLogic } from "./Fleet";
import { InspectLogic } from "./Inspection";
import { InventoryPartsLogic } from "./InventoryParts";
import { InventoryStatsLogic } from "./inventoryStat";
import { LabelLogic } from "./Label";
import { LaboursLogic } from "./Labours";
import { LoginLogics } from "./Login";
import { MatrixLogic } from "./Matrix";
import { OrderLogic } from "./Order";
import { ProfileInfoLogic } from "./ProfileInfo";
import { ServiceLogic } from "./Service";
import { SignUpLogic } from "./SignUp";
import { StandardRateLogic } from "./RateStandard";
import { TiersLogic } from "./Tier";
import { TimeClockLogic } from "./TimeLog";
import { UsersLogic } from "./Users";
import { VehicleLogic } from "./Vehicles";
import { VendorLogic } from "./Vendor";
import { ActivityLogic } from "./Activity";
import { MessageLogic } from "./Message";
import { OrderSummaryLogic } from "./OrderSummary";
import { AppointmentLogics } from "./Appointments";
import { PaymentLogic } from "./Payment";
import { SubscriptionLogic } from "./Subscription";
import { DashboardLogics } from "./Dashboard";
import { ReportLogics } from "./Reports";
import { PdfLogic } from "./Pdf";
import { HomePageLogic } from "./HomePage";
import { FaqPageLogic } from "./FaqPage";

export const redirectToLogic = createLogic({
  type: "REDIRET_TO",
  async process({ action }, dispatch, done) {
    dispatch(push(action.payload.path));
    done();
  }
});

export default [
  ...LoginLogics,
  ...SignUpLogic,
  ...UsersLogic,
  ...MatrixLogic,
  ...ProfileInfoLogic,
  ...FleetLogic,
  ...StandardRateLogic,
  ...CustomersLogic,
  ...VehicleLogic,
  ...LaboursLogic,
  ...VendorLogic,
  ...TiersLogic,
  ...InventoryPartsLogic,
  ...InventoryStatsLogic,
  ...OrderLogic,
  ...InspectLogic,
  ...ServiceLogic,
  ...LabelLogic,
  ...TimeClockLogic,
  ...ActivityLogic,
  ...MessageLogic,
  ...OrderSummaryLogic,
  ...AppointmentLogics,
  ...PaymentLogic,
  ...SubscriptionLogic,
  ...DashboardLogics,
  ...ReportLogics,
  ...PdfLogic,
  ...HomePageLogic,
  ...FaqPageLogic,
  redirectToLogic
];
