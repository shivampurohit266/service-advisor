const express = require("express");

const router = express.Router();

const {
  user,
  auth,
  role,
  vehicle,
  fleet,
  matrix,
  labour,
  customer,
  vendor,
  tier,
  inventory,
  inventoryStat,
  order,
  service,
  inspection,
  label,
  googleCaptcha,
  messageChat,
  timeClock,
  userActivity,
  payment,
  memberShipRoutes,
  webhookRoutes,
  appointmentRoutes,
  dashboardRoutes,
  reportRoutes,
  homePageRoutes,
  siteSettingRoutes,
  faqRoutes,
} = require("./index");
/**
 *
 */
router.post("/github-webhook", async (req, res) => {
  res.send({
    body: req.body
  });
});
/**
 *
 */
router.use("/auth", auth);
router.use("/user", user);
router.use("/role", role);
router.use("/vehicle", vehicle);
router.use("/fleet", fleet);
router.use("/matrix", matrix);
router.use("/labour", labour);
router.use("/customer", customer);
router.use("/vendor", vendor);
router.use("/tier", tier);
router.use("/inventory", inventory);
router.use("/inventoryStat", inventoryStat);
router.use("/order", order);
router.use("/service", service);
router.use("/inspection", inspection);
router.use("/label", label);
router.use("", googleCaptcha);
router.use("/message", messageChat);
router.use("/timeClock", timeClock);
router.use("/activity", userActivity);
router.use("/payment", payment);
router.use("/membership-plan", memberShipRoutes);
router.use("/webhooks", webhookRoutes);
router.use("/appointment", appointmentRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/reports", reportRoutes);
router.use("/home-page",homePageRoutes);
router.use("/site-setting",siteSettingRoutes);
router.use("/faq",faqRoutes);

/**
 *
 */
module.exports = router;
