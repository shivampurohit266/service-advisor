import React, { Component } from "react";
import { serviceTotalsCalculation } from "../../../helpers/Sum";
import Loader from "../../../containers/Loader/Loader";
import NoDataFound from "../../common/NoFound";
import { AppConfig } from "../../../config/AppConfig";
import Dollor from "../../common/Dollor"
import {
  Table,
  Button,
  UncontrolledTooltip
} from "reactstrap";
export class VehicleOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1
    };
  }
  handleCustomerDetails = (customerId) => {
    const customerDetailsUrl = "/customers/details/:id"
    this.props.history.push(customerDetailsUrl.replace(":id", `${customerId}`))
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
  handleCreateOrder = (vehicleId) => {
    this.props.addOrderRequest({ vehicleId: vehicleId })
  }
  render() {
    const { vehicleOrders, orderReducer, vehicleData } = this.props
    const { isOrderLoading } = orderReducer
    const { page } = this.state;
    return (
      <>
        <div className={"text-right new-vehicle-Order-btn pb-2"}>
          <Button onClick={() => this.handleCreateOrder(vehicleData._id)} color={""} className={"btn-theme"}>Create New Order</Button>
        </div>
        <Table responsive>
          <thead>
            <tr>
              <th width="20">
                S No.
              </th>
              <th width={"20"}>Order Id</th>
              <th width={"80"}>
                Order Name
              </th>
              <th width={"50"}>
                Order Authorization
              </th>
              <th width={"50"}>
                Order Status
              </th>
              <th width={"50"}>
                Customer
              </th>
              <th width={"50"}>
                Order Total
              </th>
              <th width={"50"}>
                Order Payment
              </th>
              <th width={"50"} className={"text-center"}>
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {!isOrderLoading ? (
              vehicleOrders && vehicleOrders.length ? (
                vehicleOrders.map((order, index) => {
                  const orderTotal = serviceTotalsCalculation(order.serviceId)
                  return (
                    <tr key={index}>
                      <td >
                        {(page - 1) * AppConfig.ITEMS_PER_PAGE + index + 1}.
                      </td>
                      <td>
                        #{order.orderId}
                      </td>
                      <td>
                        {order.orderName || "Unnammed"}
                      </td>
                      {
                        order.status ?
                          <td className={"text-capitalize text-success"}>authorized</td> :
                          <td className={"text-capitalize text-danger"}>unauthorized</td>
                      }
                      {
                        order.isInvoice ?
                          <td className={"text-capitalize"}>invoiced</td> :
                          <td className={"text-capitalize "}>estimate</td>
                      }
                      <td onClick={() => { this.handleCustomerDetails(order.customerId._id) }} id={`customer-details-${order._id}`} className={"text-primary cursor_pointer"}>
                        {
                          order.customerId ?
                            `${order.customerId.firstName}${" "}${order.customerId.lastName}` :
                            null

                        }
                      </td>
                      <UncontrolledTooltip target={`customer-details-${order._id}`}>
                        View Customer
                      </UncontrolledTooltip>
                      <td>
                        <Dollor value={parseFloat(orderTotal.orderGrandTotal || 0).toFixed(2)} />
                      </td>
                      {
                        order.paymentId && order.paymentId.length && order.paymentId[order.paymentId.length - 1].isFullyPaid ?
                          <td className={"text-capitalize text-success"}>Full Paid</td> :
                          <td className={"text-capitalize text-warning"}>Payment Not Completed</td>
                      }
                      <td className={"text-center"}>
                        <span className="mr-2">
                          <Button
                            className={"btn-theme-transparent"}
                            size={"sm"}
                            onClick={() => { this.handleOrderDetails(order._id) }}
                            id={`order-details-${order._id}`}
                          >
                            <i className="fas fa-eye" />
                          </Button>
                          <UncontrolledTooltip target={`order-details-${order._id}`}>
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
                        message={
                          "Currently there are no Vehicle order added."
                        }
                        onAddClick={() => this.handleCreateOrder(vehicleData._id)}
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
