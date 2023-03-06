import React from "react";
import { AppRoutes } from "./config/AppRoutes";

const Dashboard = React.lazy(() => import("./views/Dashboard"));
const WorkFlow = React.lazy(() => import("./containers/WorkFlow"));
const Calender = React.lazy(() => import("./containers/Calender"));
const Inventory = React.lazy(() => import("./containers/Inventory"));
const TimeClocks = React.lazy(() => import("./containers/TimeClocks"));
const Reports = React.lazy(() => import("./containers/Reports"));
const Users = React.lazy(() => import("./containers/Users"));
const Vehicles = React.lazy(() => import("./containers/Vehicles"));
const Fleet = React.lazy(() => import("./containers/Fleet"));
const Customers = React.lazy(() => import("./containers/Customers"));
const CommonPage = React.lazy(() => import("./containers/CommonPage"));
const PriceMatrix = React.lazy(() => import("./containers/PriceMatrix"));
const Order = React.lazy(() => import("./containers/Orders"));
const Profile = React.lazy(() => import("./containers/Profile"));
const CannedService = React.lazy(() => import("./components/Orders/Services/cannedService"));
const CustomerDetails = React.lazy(() => import("./components/Customer/CustomerView"));
const VehicleDetails = React.lazy(() => import("./components/Vehicles/VehicleView"));
const UserDetails = React.lazy(() => import("./components/UsersList/UserInfo"))
const routes = [
  {
    path: AppRoutes.HOME.url,
    exact: AppRoutes.HOME.exact,
    name: AppRoutes.HOME.name
  },
  {
    path: AppRoutes.DASHBOARD.url,
    exact: AppRoutes.DASHBOARD.exact,
    name: AppRoutes.DASHBOARD.name,
    component: Dashboard
  },
  {
    path: AppRoutes.WORKFLOW.url,
    exact: AppRoutes.WORKFLOW.exact,
    name: AppRoutes.WORKFLOW.name,
    component: WorkFlow
  },
  {
    path: AppRoutes.WORKFLOW_ORDER.url,
    exact: AppRoutes.WORKFLOW_ORDER.exact,
    name: AppRoutes.WORKFLOW_ORDER.name,
    component: Order
  },
  {
    path: AppRoutes.CALENDER.url,
    exact: AppRoutes.CALENDER.exact,
    name: AppRoutes.CALENDER.name,
    component: Calender
  },
  {
    path: AppRoutes.INVENTORY.url,
    exact: AppRoutes.INVENTORY.exact,
    name: AppRoutes.INVENTORY.name,
    component: Inventory
  },
  {
    path: AppRoutes.TIMESHEETS.url,
    exact: AppRoutes.TIMESHEETS.exact,
    name: AppRoutes.TIMESHEETS.name,
    component: TimeClocks
  },
  {
    path: AppRoutes.REPORTS.url,
    exact: AppRoutes.REPORTS.exact,
    name: AppRoutes.REPORTS.name,
    component: Reports
  },
  {
    path: AppRoutes.STAFF_MEMBERS.url,
    exact: AppRoutes.STAFF_MEMBERS.exact,
    name: AppRoutes.STAFF_MEMBERS.name,
    component: Users
  },
  {
    path: AppRoutes.STAFF_MEMBERS_DETAILS.url,
    exact: AppRoutes.STAFF_MEMBERS_DETAILS.exact,
    name: AppRoutes.STAFF_MEMBERS_DETAILS.name,
    component: UserDetails
  },
  {
    path: AppRoutes.VEHICLES.url,
    exact: AppRoutes.VEHICLES.exact,
    name: AppRoutes.VEHICLES.name,
    component: Vehicles
  },
  {
    path: AppRoutes.VEHICLES_DETAILS.url,
    exact: AppRoutes.VEHICLES_DETAILS.exact,
    name: AppRoutes.VEHICLES_DETAILS.name,
    component: VehicleDetails
  },
  {
    path: AppRoutes.FLEETS.url,
    exact: AppRoutes.FLEETS.exact,
    name: AppRoutes.FLEETS.name,
    component: Fleet
  },
  {
    path: AppRoutes.CUSTOMERS.url,
    exact: AppRoutes.CUSTOMERS.exact,
    name: AppRoutes.CUSTOMERS.name,
    component: Customers
  },
  {
    path: AppRoutes.CUSTOMER_DETAILS.url,
    exact: AppRoutes.CUSTOMER_DETAILS.exact,
    name: AppRoutes.CUSTOMER_DETAILS.name,
    component: CustomerDetails
  },
  {
    path: AppRoutes.PRICEMATRIX.url,
    exact: AppRoutes.PRICEMATRIX.exact,
    name: AppRoutes.PRICEMATRIX.name,
    component: PriceMatrix
  },
  {
    path: AppRoutes.PROFILE.url,
    exact: AppRoutes.PROFILE.exact,
    name: AppRoutes.PROFILE.name,
    component: Profile
  },
  {
    path: AppRoutes.CANNED_SERVICE.url,
    exact: AppRoutes.CANNED_SERVICE.exact,
    name: AppRoutes.CANNED_SERVICE.name,
    component: CannedService
  },
  { path: "/common", exact: true, name: "Common", component: CommonPage }
];

export const BreadCrumbRoutes = [
  {
    path: AppRoutes.HOME.url,
    exact: AppRoutes.HOME.exact,
    name: AppRoutes.HOME.name
  },
  {
    path: AppRoutes.DASHBOARD.url,
    exact: AppRoutes.DASHBOARD.exact,
    name: AppRoutes.DASHBOARD.name
  },
  {
    path: AppRoutes.WORKFLOW_ORDER.url,
    exact: AppRoutes.WORKFLOW_ORDER.exact,
    name: AppRoutes.WORKFLOW_ORDER.name
  },
  {
    path: AppRoutes.WORKFLOW.url,
    exact: AppRoutes.WORKFLOW.exact,
    name: AppRoutes.WORKFLOW.name
  },
  {
    path: AppRoutes.CALENDER.url,
    exact: AppRoutes.CALENDER.exact,
    name: AppRoutes.CALENDER.name
  },
  {
    path: AppRoutes.INVENTORY_STATATICS.url,
    exact: AppRoutes.INVENTORY_STATATICS.exact,
    name: AppRoutes.INVENTORY_STATATICS.name
  },
  {
    path: AppRoutes.INVENTORY_PARTS.url,
    exact: AppRoutes.INVENTORY_PARTS.exact,
    name: AppRoutes.INVENTORY_PARTS.name
  },
  {
    path: AppRoutes.INVENTORY_TIRES.url,
    exact: AppRoutes.INVENTORY_TIRES.exact,
    name: AppRoutes.INVENTORY_TIRES.name
  },
  {
    path: AppRoutes.INVENTORY_LABOURS.url,
    exact: AppRoutes.INVENTORY_LABOURS.exact,
    name: AppRoutes.INVENTORY_LABOURS.name
  },
  {
    path: AppRoutes.INVENTORY_VENDORS.url,
    exact: AppRoutes.INVENTORY_VENDORS.exact,
    name: AppRoutes.INVENTORY_VENDORS.name
  },
  {
    path: AppRoutes.INVENTORY.url,
    exact: AppRoutes.INVENTORY.exact,
    name: AppRoutes.INVENTORY.name
  },
  {
    path: AppRoutes.TIMESHEETS.url,
    exact: AppRoutes.TIMESHEETS.exact,
    name: AppRoutes.TIMESHEETS.name
  },
  {
    path: AppRoutes.REPORTS.url,
    exact: AppRoutes.REPORTS.exact,
    name: AppRoutes.REPORTS.name
  },
  {
    path: AppRoutes.STAFF_MEMBERS.url,
    exact: AppRoutes.STAFF_MEMBERS.exact,
    name: AppRoutes.STAFF_MEMBERS.name
  },
  {
    path: AppRoutes.STAFF_MEMBERS_DETAILS.url,
    exact: AppRoutes.STAFF_MEMBERS_DETAILS.exact,
    name: AppRoutes.STAFF_MEMBERS_DETAILS.name,
  },
  {
    path: AppRoutes.VEHICLES.url,
    exact: AppRoutes.VEHICLES.exact,
    name: AppRoutes.VEHICLES.name
  },
  {
    path: AppRoutes.FLEETS.url,
    exact: AppRoutes.FLEETS.exact,
    name: AppRoutes.FLEETS.name
  },
  {
    path: AppRoutes.CUSTOMERS.url,
    exact: AppRoutes.CUSTOMERS.exact,
    name: AppRoutes.CUSTOMERS.name
  },
  {
    path: AppRoutes.PRICEMATRIX.url,
    exact: AppRoutes.PRICEMATRIX.exact,
    name: AppRoutes.PRICEMATRIX.name
  },
  {
    path: AppRoutes.PROFILE.url,
    exact: AppRoutes.PROFILE.exact,
    name: AppRoutes.PROFILE.name
  },
  {
    path: AppRoutes.CANNED_SERVICE.url,
    exact: AppRoutes.CANNED_SERVICE.exact,
    name: AppRoutes.CANNED_SERVICE.name
  }
];

export default routes;
