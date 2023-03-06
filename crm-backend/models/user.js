const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserPermissions = new Schema({
  isAllowedDashboard: Boolean,
  isAllowedWorkflow: Boolean,
  isAllowedCalendar: Boolean,
  isAllowedInventory: Boolean,
  isAllowedTimesheets: Boolean,
  isAllowedReportCenter: Boolean,
  isAllowedCompanySettings: Boolean,
  isIncludedToCalendar: Boolean,
  isAllowedViewEveryonesCalendar: Boolean,
  isAllowedTimeclock: Boolean,
  isAllowedManualTimesheets: Boolean,
  isAllowedInspections: Boolean,
  isAllowedCannedJobs: Boolean,
  isAllowedPricingMatrices: Boolean,
  isAllowedMessagingCustomers: Boolean,
  isPreventEditingUponAuthorize: Boolean,
  isPreventEditingUponInvoice: Boolean,
  isFilteredWorkflowByTechnician: Boolean,
  isAllowedProfitability: Boolean,
  isNotifyJobAssigned: Boolean,
  isNotifyOrderAuthorized: Boolean,
  isNotifyCustomerSendsMessage: Boolean,
  isNotifyCustomerMakesPayment: Boolean,
  isNotifyChangeAppointmentStatus: Boolean
});

const userSchema = new Schema({
  firstName: {
    type: String,
    default: null
  },
  lastName: {
    type: String,
    default: null
  },
  email: {
    type: String,
    required: true
  },
  normalizedEmail: {
    type: String,
    required: true
  },
  password: {
    type: String,
    default: null
  },
  verifyToken: {
    type: String,
    default: null
  },
  roleType: {
    type: Schema.Types.ObjectId,
    ref: "role",
    required: true
  },
  permissions: {
    type: UserPermissions
  },
  phone: {
    type: String
  },
  firstTimeUser: {
    type: Boolean,
    default: false
  },
  userSideActivation: {
    type: Boolean,
    default: false
  },
  userSideActivationValue: {
    type: String,
    default: null
  },
  status: {
    type: Boolean,
    default: true
  },
  loggedInIp: {
    type: String,
    default: null
  },
  loggedInAt: {
    type: Date,
    default: null
  },
  salt: {
    type: String,
    default: null
  },
  companyName: {
    type: String,
    default: null
  },
  website: {
    type: String,
    default: null
  },
  peopleWork: {
    type: String,
    default: null
  },
  serviceOffer: {
    type: [String],
    default: null
  },
  companyNumber: {
    type: String
  },
  currency: {
    type: String
  },
  timeZone: {
    type: Object
  },
  vatNumber: {
    type: String
  },
  vehicleService: {
    type: [String],
    default: null
  },
  shopLogo: {
    type: Object,
    default: null
  },
  parentId: {
    type: mongoose.Types.ObjectId,
    ref: "user",
    default: null
  },
  stripeCustomerId: {
    type: String
  },
  planId: {
    type: mongoose.Types.ObjectId,
    ref: "plan"
  },
  planExiprationDate: {
    type: Date,
    default: Date.now
  },
  address: {
    type: String
  },
  isInTrialPeriod: {
    type: Boolean,
    default: true
  },
  rate: {
    type: Number,
    default: null
  },
  subdomain: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  currentlyWorking: {
    type: new Schema({
      serviceId: {
        type: mongoose.Types.ObjectId,
        ref: "Service"
      },
      orderId: {
        type: Schema.Types.ObjectId,
        ref: "Order"
      },
      generalService: {
        type: Boolean,
        default: false
      },
      startTime: {
        type: Date,
        default: Date.now
      }
    }),
    default: {},
  },
  anniversary: {
    type: Date,
    default: Date.now
  },
  dob: {
    type: Date,
    default: Date.now
  },
});

module.exports = mongoose.model("user", userSchema);
