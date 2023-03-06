import { createAction } from "redux-actions";

export * from "./Login";
export * from "./SignUp";
export * from "./Users";
export * from "./Customers";
export * from "./Matrix";
export * from "./ProfileInfo";
export * from "./RateStandard";
export * from "./Fleet";
export * from "./ModelOperation";
export * from "./Vehicles";
export * from "./Labours";
export * from "./InventoryVendor";
export * from "./Tier";
export * from "./InventoryParts";
export * from "./InventorySats";
export * from "./Order";
export * from "./Inspection";
export * from "./Service";
export * from "./Label";
export * from "./TimeLog";
export * from "./Activity";
export * from "./Message";
export * from "./OrderSummary";
export * from "./Appointments";
export * from "./Payment";
export * from "./Subscription";
export * from "./Dashboard";
export * from "./Reports";
export * from "./Pdf";
export * from "./HomePage";
export * from "./SiteSetting";
export * from "./Faq";

//
export const redirectTo = createAction("REDIRET_TO");
//
export const showLoader = createAction("SHOW_LOADER");
export const hideLoader = createAction("HIDE_LOADER");
