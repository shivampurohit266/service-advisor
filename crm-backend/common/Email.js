const commonSmtp = require("./index");
const fs = require("fs");
var path = require("path");

const AvailiableTemplates = {
  SIGNUP_CONFIRMATION: "signupConfirm",
  USER_ADDED_CONFIRMATION: "userConfirm",
  SIGNUP: "signup",
  SIGNUP_BY_ADMIN: "userProfileEmail",
  UPDATE_BY_ADMIN: "updateUserProfile",
  FORGET_PASSWORD: "forgotPassword",
  ORDER_COMPLETE: "orderComplete",
  WEBINAR_ORDER_COMPLETE: "webinarOrder",
  ADMIN_ORDER_EMAIL: "adminEmail",
  ADMIN_WEBINAR_ORDER_EMAIL: "adminWebinarOrder",
  WEBINAR_NOTIFICATION: "webinarNotification",
  REFUND_ORDER: "refundOrderUserEmail",
  REFUND_ORDER_ADMIN: "refundOrderAdminEmail",
  NEWSLETTER_EMAIL: "newsletterEmail",
  UNSUBSCRIBE_EMAIL: "unSubscribeEmail",
  INSPECTION_TEMPLATE: "inspectionTemplate",
  SUBSCRIPTION_TEMPLATE: "subscriptionPlan",
  APPOINTMENT: "appointment"
};
class Email {
  constructor(req) {
    const host =
      req.headers && req.headers.referer
        ? req.headers.referer.split("/")
        : null;
    this.host = host ? [host[0], host[1], host[2]].join("/") : null;
    this.body = "";
    this.subject = "";
    this.to = "";
    this.cc = [];
    this.attachments = [];
  }
  async setTemplate(templateName, replaceObject = {}) {
    if (!templateName) {
      throw new Error("Please provide template name", 400);
    }
    switch (templateName) {
      case AvailiableTemplates.SIGNUP_CONFIRMATION:
        this.subject = "[Service Advisor] Please confirm your email address";
        break;
      case AvailiableTemplates.SIGNUP:
        this.subject = "[Service Advisor] Registration";
        break;
      case AvailiableTemplates.USER_ADDED_CONFIRMATION:
        this.subject =
          "[Service Advisor] You've Been Invited to Join Service Advisor ";
        break;

      case AvailiableTemplates.UPDATE_BY_ADMIN:
        this.subject = "[Service Advisor] Updated Your Password";
        break;

      case AvailiableTemplates.FORGET_PASSWORD:
        this.subject = "[Service Advisor] Reset Password";
        break;
      case AvailiableTemplates.ORDER_COMPLETE:
        this.subject = "[Service Advisor] Order Complete";
        break;
      case AvailiableTemplates.WEBINAR_ORDER_COMPLETE:
        this.subject = "[Service Advisor] Order Complete";
        break;
      case AvailiableTemplates.ADMIN_ORDER_EMAIL:
        this.subject = "[Service Advisor] New Order Placed";
        break;
      case AvailiableTemplates.ADMIN_WEBINAR_ORDER_EMAIL:
        this.subject = "[Service Advisor] New Order Placed";
        break;
      case AvailiableTemplates.WEBINAR_NOTIFICATION:
        this.subject = "[Service Advisor] Webinar Notification";
        break;
      case AvailiableTemplates.REFUND_ORDER:
        this.subject = "[Service Advisor] Refund Order";
        break;
      case AvailiableTemplates.REFUND_ORDER_ADMIN:
        this.subject = "[Service Advisor] Refund Order Successfully";
        break;
      case AvailiableTemplates.NEWSLETTER_EMAIL:
        this.subject = "[Service Advisor] Subscription";
        break;
      case AvailiableTemplates.UNSUBSCRIBE_EMAIL:
        this.subject = "[Service Advisor] Unsubscription";
        break;
      case AvailiableTemplates.INSPECTION_TEMPLATE:
        // this.subject = "[Service Advisor] Unsubscription";
        break;
      case AvailiableTemplates.SUBSCRIPTION_TEMPLATE:
        this.subject = "[Service Advisor] Plan Purchase Successfully";
        break;
      case AvailiableTemplates.APPOINTMENT:
        //this.subject = "[Service Advisor] Appointment scheduled";
        break;
      default:
        throw new Error("Invalid template name", 400);
    }
    let content = fs.readFileSync(
      path.join(__dirname, `./emailtemplates/${templateName}.html`),
      "utf8"
    );
    replaceObject.webURL = this.host;

    for (const key in replaceObject) {
      if (replaceObject.hasOwnProperty(key)) {
        const val = replaceObject[key];
        content = content.replace(new RegExp(`{${key}}`, "g"), val);
      }
    }
    this.body = content;
    return content;
  }
  setSubject(subject) {
    this.subject = subject;
  }
  setBody(body) {
    this.body = body;
  }
  setAttachements(attachments) {
    this.attachments = attachments;
  }
  setCC(cc) {
    this.cc = cc;
  }
  async sendEmail(email) {
    if (!email) {
      throw new Error("Please provide email.");
    }
    const mailOption = {
      from: "Sevice Advisor <test.chapter247@gmail.com>",
      to: this.to || email,
      cc: this.cc,
      subject: this.subject,
      html: this.body,
      debug: true,
      attachments: this.attachments
    };
    const resp = await commonSmtp.smtpTransport.sendMail(mailOption);
    return resp;
  }
}

module.exports = {
  Email,
  AvailiableTemplates
};
