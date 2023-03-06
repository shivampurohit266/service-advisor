export const AppRoutes = {
  HOME: {
    url: "/",
    name: "Dashboard",
    exact: true
  },
  DASHBOARD: {
    url: "/dashboard",
    name: "",
    exact: true
  },
  WORKFLOW: {
    url: "/workflow",
    name: "Workflow",
    exact: true
  },
  WORKFLOW_ORDER: {
    url: "/workflow/order/:id",
    name: "Order",
    exact: true
  },
  WORKFLOW_ORDER_SERVICES: {
    url: "/workflow/order/service",
    name: "Service",
    exact: true
  },
  WORKFLOW_ORDER_INSPECTION: {
    url: "/workflow/order/inspection",
    name: "Inspection",
    exact: true
  },
  WORKFLOW_ORDER_TIME_CLOCK: {
    url: "/workflow/order/timeClock",
    name: "Time Clocks",
    exact: true
  },
  WORKFLOW_ORDER_MESSAGES: {
    url: "/workflow/order/message",
    name: "Messages",
    exact: true
  },
  CALENDER: {
    url: "/calendar",
    name: "Calendar",
    exact: true
  },
  INVENTORY: {
    url: "/inventory",
    name: "Inventory",
    exact: false
  },
  INVENTORY_PARTS: {
    url: "/inventory/parts",
    name: "Parts",
    exact: true
  },
  INVENTORY_TIRES: {
    url: "/inventory/tires",
    name: "Tires",
    exact: true
  },
  INVENTORY_LABOURS: {
    url: "/inventory/labor",
    name: "Labor",
    exact: true
  },
  INVENTORY_VENDORS: {
    url: "/inventory/vendors",
    name: "Vendors",
    exact: true
  },
  INVENTORY_STATATICS: {
    url: "/inventory/statistics",
    name: "Statistics",
    exact: true
  },
  TIMESHEETS: {
    url: "/time-clocks",
    name: "Time Clocks",
    exact: true
  },
  REPORTS: {
    url: "/reports",
    name: "Reports",
    exact: true
  },
  STAFF_MEMBERS: {
    url: "/settings/technician",
    name: "Technician",
    exact: true
  },
  STAFF_MEMBERS_DETAILS: {
    url: "/settings/technician/details/:id",
    name: "Technician Details",
    exact: true
  },
  VEHICLES: {
    url: "/vehicles",
    name: "Vehicles",
    exact: true
  },
  VEHICLES_DETAILS: {
    url: "/vehicles/details/:id",
    name: "Vehicles Details",
    exact: true
  },
  FLEETS: {
    url: "/settings/fleets",
    name: "Fleets",
    exact: true
  },
  CUSTOMERS: {
    url: "/customers",
    name: "Customers",
    exact: true
  },
  CUSTOMER_DETAILS: {
    url: "/customers/details/:id",
    name: "Customers Details",
    exact: true
  },
  PRICEMATRIX: {
    url: "/settings/pricematrix",
    name: "Price Matrix",
    exact: true
  },
  SETTINGS: {
    url: "/settings",
    name: "Workspace",
    exact: true
  },
  PROFILE: {
    url: "/profile",
    name: "Profile",
    exact: true
  },
  CANNED_SERVICE: {
    url: "/workflow/canned-service/:id",
    name: "Canned Service",
    exact: true
  }
};
