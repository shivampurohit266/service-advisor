const express = require("express");

const router = express.Router();
const orderController = require("../../controllers/frontend/orderController");
const token = require("../../common/token");

// Get order count
router.get("/orderId", token.authorisedUser, orderController.countOrderNumber);

// create new order
router.post("/addOrder", token.authorisedUser, orderController.createNewOrder);

// get orders
router.get("/getOrders", token.authorisedUser, orderController.listOrders);
//
router.delete(
  "/deleteOrder",
  token.authorisedUser,
  orderController.deleteOrder
);
// update orders status
router.post(
  "/updateOrderStatus",
  token.authorisedUser,
  orderController.updateOrderWorkflowStatus
);

//
router.post(
  "/addOrderStatus",
  token.authorisedUser,
  orderController.addOrderStatus
);
//
router.post(
  "/addOrderStatus",
  token.authorisedUser,
  orderController.addOrderStatus
);

//
router.delete(
  "/deleteOrderStatus",
  token.authorisedUser,
  orderController.deleteOrderStatus
);
//
router.put(
  "/updateOrderOfOrderStatus",
  token.authorisedUser,
  orderController.updateWorkflowStatusOrder
);

/**
 *
 */
router.put(
  "/updateOrderDetails",
  token.authorisedUser,
  orderController.updateOrderDetails
);
/**
 *
 */
router.get(
  "/orderDetails",
  token.authorisedUser,
  orderController.getOrderDetails
);
/**
 * 
 */
router.put(
  "/update-order-status-name",
  token.authorisedUser,
  orderController.updateOrderStatusNameLogic
)
module.exports = router;
