const { StripeAPIKey } = require("./../../config/app");
const stripe = require("stripe")(StripeAPIKey);
const PlanModel = require("./../../models/plan");
const UserModel = require("./../../models/user");
const TransactionModel = require("./../../models/transaction");
const { validationResult } = require("express-validator/check");
const commonValidation = require("../../common");
const moment = require("moment");
/**
 *
 */
const subscribe = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: commonValidation.formatValidationErr(errors.mapped(), true),
      success: false
    });
  }
  try {
    const { body, currentUser } = req;
    const { planId, cardNumber, expMonth, expYear, cvv } = body;
    const { id: userId } = currentUser;
    const plan = await PlanModel.findById(planId);
    if (!plan) {
      return res.status(400).json({
        message: "Invalid plan selected!"
      });
    }
    console.log("Is a valid plan");
    const userDetails = await UserModel.findById(userId).populate("planId");
    if (!userDetails) {
      return res.status(400).json({
        message: "Invalid user!"
      });
    }
    console.log("Is a valid user");
    let customerId = null;
    if (userDetails.stripeCustomerId) {
      console.log("Existing stripe custsomer found.");
      try {
        const customer = await stripe.customers.retrieve(
          userDetails.stripeCustomerId
        );
        if (customer.deleted) {
          throw new Error("Customer is deleted!");
        }
        console.log("Existing custsomer retrieved successfully");
      } catch (error) {
        console.log(
          "Error, while fetching details of customer from stripe:",
          error.message
        );
      }
    }
    if (!customerId) {
      let tokenId = null;
      try {
        const token = await stripe.tokens.create({
          card: {
            number: cardNumber,
            exp_month: expMonth,
            exp_year: expYear,
            cvc: cvv
          }
        });
        tokenId = token.id;
        console.log("Stripe token for card created succesfully", tokenId);
      } catch (error) {
        console.log("Error, while creating token for stripe:", error.message);
      }
      if (userDetails.planId) {
        console.log(
          `User already subscribed to another(${userDetails.planId.name}) plan`
        );
        try {
          await stripe.subscriptions.del(userDetails.planId.stripeId);
          console.log(
            `Previous subscription for ${
            userDetails.planId.name
            }) plan has been cancelled.`
          );
        } catch (error) {
          console.log(
            "Error, while cancelling old subcription from stripe:",
            error.message
          );
        }
      }
      if (tokenId) {
        try {
          const customer = await stripe.customers.create({
            name: `${userDetails.firstName} ${userDetails.lastName}`,
            email: `${userDetails.email}`,
            description: `Customer for ServiceAdvisor.io`,
            source: tokenId
          });
          customerId = customer.id;
          console.log("Customer Created successfully!");
          const planExpDate = new Date(moment(new Date(), "DD-MM-YYYY").add(30, 'days'));
          await UserModel.updateOne(
            {
              _id: userId
            },
            {
              $set: { stripeCustomerId: customerId, planId: plan._id, planExiprationDate: planExpDate }
            }
          );
        } catch (error) {
          console.log("Error, while creating customer for stripe:", error);
        }
      }
    }
    let transcation = {};
    if (customerId) {
      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [
          {
            plan: plan.stripeId
          }
        ]
      });
      console.log("subscription Created successfully!");
      transcation = await TransactionModel.create({
        transactionType: "subscription",
        transactionId: subscription.id,
        amount: plan.amount,
        userId,
        parentId: userId,
        transactionDetails: subscription
      });
    }
    return res.status(200).json({
      message: "Subscribed Successfully!",
      transcation
    });
  } catch (error) {
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
const getPlansList = async (req, res) => {
  try {
    const planList = await PlanModel.find({ isDeleted: false });
    return res.status(200).json({
      data: planList || [],
      success: true
    });
  } catch (error) {
    return res.status(500).json({
      responsecode: 500,
      message: error.message ? error.message : "Unexpected error occure.",
      success: false
    });
  }
};

module.exports = { subscribe, getPlansList };
