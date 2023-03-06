import { AppRoutes } from "./config/AppRoutes";

export default {
  items: [
    {
      name: AppRoutes.HOME.name,
      url: AppRoutes.DASHBOARD.url,
      icon: "icons cui-dashboard",
      authKey: "isAllowedDashboard"
    },
    {
      name: AppRoutes.CUSTOMERS.name,
      url: AppRoutes.CUSTOMERS.url,
      icon: "icons icon-user",
      authKey: "isAllowedCompanySettings"
    },
    {
      name: AppRoutes.WORKFLOW.name,
      url: AppRoutes.WORKFLOW.url,
      icon: "fas fa-network-wired",
      authKey: "isAllowedCalendar"
    },
    {
      name: AppRoutes.CALENDER.name,
      url: AppRoutes.CALENDER.url,
      icon: "icons icon-calendar",
      authKey: "isAllowedCalendar"
    },
    {
      name: AppRoutes.TIMESHEETS.name,
      url: AppRoutes.TIMESHEETS.url,
      icon: "icon-clock icons",
      authKey: "isAllowedCalendar"
    },
    {
      name: AppRoutes.INVENTORY.name,
      url: AppRoutes.INVENTORY.url,
      icon: "icons icon-layers",
      authKey: "isAllowedInventory",
      children: [
        {
          name: AppRoutes.INVENTORY_STATATICS.name,
          url: AppRoutes.INVENTORY_STATATICS.url,
          authKey: "isAllowedInventory",
          icon: "icons icon-chart"
        },
        {
          name: AppRoutes.INVENTORY_PARTS.name,
          url: AppRoutes.INVENTORY_PARTS.url,
          authKey: "isAllowedInventory",
          icon: "icons icon-puzzle"
        },
        {
          name: AppRoutes.INVENTORY_TIRES.name,
          url: AppRoutes.INVENTORY_TIRES.url,
          authKey: "isAllowedInventory",
          icon: "icons icon-support"
        },
        {
          name: AppRoutes.INVENTORY_LABOURS.name,
          url: AppRoutes.INVENTORY_LABOURS.url,
          authKey: "isAllowedInventory",
          icon: "icons icon-user"
        },
        {
          name: AppRoutes.INVENTORY_VENDORS.name,
          url: AppRoutes.INVENTORY_VENDORS.url,
          authKey: "isAllowedInventory",
          icon: "fa fa-handshake-o"
        }
      ]
    },
    {
      name: AppRoutes.VEHICLES.name,
      url: AppRoutes.VEHICLES.url,
      icon: "fas fa-truck",
      authKey: "isAllowedCompanySettings"
    },
    {
      name: AppRoutes.REPORTS.name,
      url: AppRoutes.REPORTS.url,
      icon: "fas fa-pie-chart",
      authKey: "isAllowedReportCenter"
    },
    {
      name: AppRoutes.SETTINGS.name,
      url: AppRoutes.SETTINGS.url,
      icon: "icon-settings",
      authKey: "isAllowedCompanySettings",
      children: [
        {
          name: AppRoutes.STAFF_MEMBERS.name,
          url: AppRoutes.STAFF_MEMBERS.url,
          icon: "icons icon-people",
          authKey: "isAllowedCompanySettings"
        },
        {
          name: AppRoutes.FLEETS.name,
          url: AppRoutes.FLEETS.url,
          icon: "fas fa-car",
          authKey: "isAllowedCompanySettings"
        },
        {
          name: AppRoutes.PRICEMATRIX.name,
          url: AppRoutes.PRICEMATRIX.url,
          icon: "fas fa-hand-holding-usd",
          authKey: "isAllowedCompanySettings",
        }
      ]
    }
  ]
};

export const ValidatedRoutes = [
  {
    url: AppRoutes.DASHBOARD.url,
    authKey: "isAllowedDashboard"
  },
  {
    url: AppRoutes.WORKFLOW.url,
    authKey: "isAllowedWorkflow"
  },
  {
    url: AppRoutes.WORKFLOW_ORDER.url,
    authKey: "isAllowedWorkflow"
  },
  {
    url: AppRoutes.WORKFLOW_ORDER_SERVICES.url,
    authKey: "isAllowedWorkflow"
  },
  {
    url: AppRoutes.WORKFLOW_ORDER_INSPECTION.url,
    authKey: "isAllowedWorkflow"
  },
  {
    url: AppRoutes.WORKFLOW_ORDER_TIME_CLOCK.url,
    authKey: "isAllowedCalendar"
  },
  {
    url: AppRoutes.WORKFLOW_ORDER_MESSAGES.url,
    authKey: "isAllowedCalendar"
  },
  {
    url: AppRoutes.CALENDER.url,
    authKey: "isAllowedCalendar"
  },
  {
    url: AppRoutes.TIMESHEETS.url,
    authKey: "isAllowedCalendar"
  },
  {
    url: AppRoutes.INVENTORY.url,
    authKey: "isAllowedInventory"
  },
  {
    url: AppRoutes.INVENTORY_PARTS.url,
    authKey: "isAllowedInventory"
  },
  {
    url: AppRoutes.INVENTORY_TIRES.url,
    authKey: "isAllowedInventory"
  },
  {
    url: AppRoutes.INVENTORY_LABOURS.url,
    authKey: "isAllowedInventory"
  },
  {
    url: AppRoutes.INVENTORY_VENDORS.url,
    authKey: "isAllowedInventory"
  },
  {
    url: AppRoutes.STAFF_MEMBERS.url,
    authKey: "isAllowedCompanySettings"
  },
  {
    url: AppRoutes.STAFF_MEMBERS_DETAILS.url,
    authKey: "isAllowedCompanySettings"
  },
  {
    url: AppRoutes.CUSTOMERS.url,
    authKey: "isAllowedCompanySettings"
  },
  {
    url: AppRoutes.CUSTOMER_DETAILS.url,
    authKey: "isAllowedCompanySettings"
  },
  {
    url: AppRoutes.VEHICLES.url,
    authKey: "isAllowedCompanySettings"
  },
  {
    url: AppRoutes.VEHICLES_DETAILS.url,
    authKey: "isAllowedCompanySettings"
  },
  {
    url: AppRoutes.FLEETS.url,
    authKey: "isAllowedCompanySettings"
  },
  {
    url: AppRoutes.INVENTORY_STATATICS.url,
    authKey: "isAllowedInventory"
  },
  {
    url: AppRoutes.PRICEMATRIX.url,
    authKey: "isAllowedCompanySettings"
  },
  {
    url: AppRoutes.PROFILE.url,
    authKey: "isAllowedCompanySettings"
  },
  {
    url: AppRoutes.CANNED_SERVICE.url,
    authKey: "isAllowedCannedJobs"
  },
  {
    url: AppRoutes.REPORTS.url,
    authKey: "isAllowedReportCenter"
  }
];
