const UserModel = require("./../../models/user");
const moment = require("moment");
const { Email, AvailiableTemplates } = require("./../../common/Email");
/**
 *
 */
const paymentSuccess = async (req, data) => {
  const {
    customer,
    customer_email,
    period_start,
    period_end,
    invoice_pdf
  } = data;
  const userData = await UserModel.findOne({
    stripeCustomerId: customer,
    email: customer_email,
    isDeleted: false
  }).populate("planId");

  if (!userData) {
    throw new Error("Unkown user details.");
  }
  
  await UserModel.updateOne(
    {
      _id: userData.id
    },
    {
      $set: {
        isInTrialPeriod: false,
        planExiprationDate: moment.unix(period_end).toISOString()
      }
    }
  );
  try {
    const email = new Email(req);
    email.setTemplate(AvailiableTemplates.SUBSCRIPTION_TEMPLATE, {
      firstName: userData.firstName,
      lastName: userData.lastName,
      status: "created",
      plan_name: userData.planId && userData.planId.name ? userData.planId.name : "Unnamed Plan"
    });
    email.setAttachements([
      {
        filename: `Invoice for ${moment
          .unix(period_start)
          .format("YYYY-MM-DD")} - ${moment
            .unix(period_end)
            .format("YYYY-MM-DD")}.pdf`,
        path: invoice_pdf
      }
    ]);
    email.sendEmail(userData.email);
    console.log("Email Sent success for success invoice.");
  } catch (error) {
    console.log("Send email error", error.message);
    throw new Error("Oopps! there is an error sending email.");
  }
  return true;
};
/**
 *
 */
const paymentFailed = async (req, data) => {
  const { customer, customer_email } = data;

  const userData = await UserModel.findOne({
    stripeCustomerId: customer,
    email: customer_email,
    isDeleted: false
  });

  try {
    const email = new Email(req);
    email.setTemplate(AvailiableTemplates.SIGNUP_CONFIRMATION);
    email.sendEmail(userData.email);
    console.log("Email Sent success for success invoice.");
  } catch (error) {
    console.log("Send email error", error.message);
    throw new Error("Oopps! there is an error sending email.");
  }
  return true;
};
/**
 *
 */
const subscriptionUpdated = async (req, res) => {
  try {
    const { body } = req;
    const { data: tempData, type } = body;
    const { object: data } = tempData;
    const { object: event } = data;

    if (event.toString() !== "invoice") {
      console.log("Event", event);
      return res.status(400).json({
        message: "Oopps! we doesn't support other events then invoice."
      });
    }

    switch (type) {
      case "invoice.payment_succeeded":
        try {
          await paymentSuccess(req, data);
        } catch (error) {
          console.log("Error in updating and sending email", event.message);
          return res.status(400).json({
            message:
              event.message ||
              "Oopps! We are having issue while update user details."
          });
        }
        break;
      case "invoice.payment_failed":
        try {
          await paymentFailed(req, data);
        } catch (error) {
          console.log("Error in updating and sending email", event.message);
          return res.status(400).json({
            message:
              event.message ||
              "Oopps! We are having issue while update user details."
          });
        }
        break;
      default:
        console.log("Event type", type);
        return res.status(400).json({
          message: "Oopps! we doesn't support other events then invoice."
        });
    }

    return res.status(200).json({
      message: "Subscription updated successfully."
    });
  } catch (error) {
    console.log("Error in subscription handler", error);
    return res.status(500).json({
      responsecode: 500,
      message: error.message ? error.message : "Unexpected error occure.",
      success: false
    });
  }
};
/**
 *
 */
module.exports = { subscriptionUpdated };
