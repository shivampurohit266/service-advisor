import React, { Component } from "react";
import { Table, Button, UncontrolledTooltip } from "reactstrap";
import { serviceTotalsCalculation } from "../../../helpers"
import Loader from "../../../containers/Loader/Loader";
import NoDataFound from "../../common/NoFound";
import { AppConfig } from "../../../config/AppConfig";
import Dollor from "../../common/Dollor"
export class CustomerOrders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1
    };
  }
  handleOrderDetails = (orderId) => {
    const orderUrl = "/workflow/order/:id"
    this.props.redirectTo(
      `${orderUrl.replace(
        ":id",
        orderId
      )}`
    );
  }
  handleVehicleDetails = (vehicleId) => {
    const vehicleUrl = "/vehicles/details/:id"
    this.props.redirectTo(
      `${vehicleUrl.replace(
        ":id",
        vehicleId
      )}`
    );
  }
  handleCreateOrder = (customerId) => {
    this.props.addOrderRequest({ customerId: customerId })
  }
  render() {
    const { customerOrders, orderReducer, customerDetails } = this.props
    const { isOrderLoading } = orderReducer
    const { page } = this.state;
    return (
      <>
        <div className={"text-right new-Order-btn pb-2"}>
          <Button
            onClick={() => this.handleCreateOrder(customerDetails ? customerDetails._id : null)}
            color={""}
            className={"btn-theme"}
          >
            Create New Order
          </Button>
        </div>
        <Table responsive>
          <thead>
            <tr>
              <th width="20">S No.</th>
              <th width={"20"}>Order Id</th>
              <th width={"100"}>Order Name</th>
              <th width={"50"}>Order Authorization</th>
              <th width={"50"}>Order Status</th>
              <th width={"50"}>Vehicle</th>
              <th width={"50"}>Order Total</th>
              <th width={"50"}>Order Payment</th>
              <th width={"50"} className={"text-center"}>
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {!isOrderLoading ? (
              customerOrders && customerOrders.length ? (
                customerOrders.map((order, index) => {
                  const orderTotal = serviceTotalsCalculation(
                    order.serviceId
                  );
                  return (
                    <tr key={index}>
                      <td>
                        {(page - 1) * AppConfig.ITEMS_PER_PAGE + index + 1}.
                      </td>
                      <td>#{order.orderId}</td>
                      <td>
                        {" "}
                        <div
                          className={
                            "font-weight-semibold text-capitalize pb-1"
                          }
                        >
                          {order.orderName || "Unnammed"}
                        </div>
                      </td>
                      {order.status ? (
                        <td className={"text-capitalize text-success"}>
                          authorized
                        </td>
                      ) : (
                          <td className={"text-capitalize text-danger"}>
                            unauthorized
                        </td>
                        )}
                      {order.isInvoice ? (
                        <td className={"text-capitalize"}>invoiced</td>
                      ) : (
                          <td className={"text-capitalize "}>estimate</td>
                        )}
                      <td className={"text-primary"}>
                        {order.vehicleId ? (
                          <>
                            <div
                              onClick={() => {
                                this.handleVehicleDetails(order.vehicleId._id);
                              }}
                              id={`vehicle-details-${order._id}`}
                              className={"cursor_pointer"}
                            >
                              {`${order.vehicleId.make}${" "}${
                                order.vehicleId.modal
                                }`}{" "}
                            </div>
                            <UncontrolledTooltip
                              target={`vehicle-details-${order._id}`}
                            >
                              View Vehicle
                            </UncontrolledTooltip>
                          </>
                        ) : null}
                      </td>

                      <td>
                        <Dollor
                          value={parseFloat(
                            orderTotal.orderGrandTotal || 0
                          ).toFixed(2)}
                        />
                      </td>
                      {order.paymentId &&
                        order.paymentId.length &&
                        order.paymentId[order.paymentId.length - 1]
                          .isFullyPaid ? (
                          <td className={"text-capitalize text-success"}>
                            Full Paid
                        </td>
                        ) : (
                          <td className={"text-capitalize text-warning"}>
                            Payment Not Completed
                        </td>
                        )}
                      <td className={"text-center"}>
                        <span className="mr-2">
                          <Button
                            className={"btn-theme-transparent"}
                            size={"sm"}
                            onClick={() => {
                              this.handleOrderDetails(order._id);
                            }}
                            id={`order-details-${order._id}`}
                          >
                            <i className="fas fa-eye" />
                          </Button>
                          <UncontrolledTooltip
                            target={`order-details-${order._id}`}
                          >
                            View Order
                          </UncontrolledTooltip>
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                  <tr>
                    <td className={"text-center"} colSpan={12}>
                      <NoDataFound
                        showAddButton
                        message={"Currently there are no Orders created."}
                        onAddClick={() =>
                          this.handleCreateOrder(customerDetails._id)
                        }
                      />
                    </td>
                  </tr>
                )
            ) : (
                <tr>
                  <td className={"text-center"} colSpan={12}>
                    <Loader />
                  </td>
                </tr>
              )}
          </tbody>
        </Table>
      </>
    );
  }
}
