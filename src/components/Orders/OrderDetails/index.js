import React, { Component } from "react";
import moment from "moment";
import {
  Button,
  ButtonGroup,
  UncontrolledTooltip,
  UncontrolledPopover,
  PopoverHeader,
  PopoverBody,
  FormGroup,
  Input
} from "reactstrap";
import {
  getSumOfArray,
  calculateValues,
  calculateSubTotal
} from "../../../helpers";
import Dollor from "../../common/Dollor";
import "./index.scss";
import { CrmPaymentModel } from "../../common/CrmPaymentModal";
import Select from "react-select";
import AddAppointment from "../../Appointments/AddAppointment";

class OrderDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderId: "",
      query: "",
      poNumber: "",
      isTextField: false,
      orderStatus: false,
      activityLogs: [],
      serviceDataObject: {},
      activeService: false,
      isFleetAllow: false
    };
  }

  componentDidMount = () => {
    const { activityReducer, orderReducer } = this.props;
    const orderId = orderReducer.orderItems ? orderReducer.orderItems._id : "";
    this.setState({
      activityLogs: activityReducer.activity,
      poNumber: this.props.orderReducer && this.props.orderReducer.orderItems && this.props.orderReducer.orderItems.poNumber !== null ? this.props.orderReducer.orderItems.poNumber : "",
      isTextField: false
    });
    this.props.getAppointments({
      technicianId: null,
      vehicleId: null,
      orderId: orderId
    });
  };

  componentDidUpdate = ({ activityReducer, isPrint, appointmentReducer, orderReducer }) => {
    const activityData = this.props.activityReducer;
    const orderId = this.props.orderReducer.orderItems._id;
    const appointmentReducerData = this.props.appointmentReducer;

    if (activityReducer !== activityData) {
      this.setState({
        activityLogs: activityData.activity
      });
    }
    if (isPrint !== this.props.isPrint) {
      this.setState({
        activeService: true
      });
    }
    if (
      appointmentReducer.data.length &&
      appointmentReducerData.data.length !== appointmentReducer.data.length
    ) {
      this.props.getAppointments({
        technicianId: null,
        vehicleId: null,
        orderId: orderId
      });
    }
    if (this.props.orderReducer && this.props.orderReducer.orderItems && this.props.orderReducer.orderItems.poNumber && orderReducer.orderItems && orderReducer.orderItems.poNumber && this.props.orderReducer.orderItems.poNumber !== orderReducer.orderItems.poNumber) {
      this.setState({
        poNumber: this.props.orderReducer.orderItems.poNumber,
        isTextField: false
      })
    }
  };

  toggleAddAppointModal = () => {
    const { modelInfoReducer } = this.props;
    const { modelDetails } = modelInfoReducer;
    const { showAddAppointmentModal } = modelDetails;
    this.props.modelOperate({
      showAddAppointmentModal: !showAddAppointmentModal
    });
  };

  handlePaymentModal = () => {
    const { modelInfoReducer, modelOperate } = this.props;
    const { modelDetails } = modelInfoReducer;
    const { paymentModalOpen } = modelDetails;
    modelOperate({
      paymentModalOpen: !paymentModalOpen
    });
  };

  handleType = (e, workflowStatus, orderId, groupedOptions) => {
    const { orderReducer } = this.props;
    const { orderData } = orderReducer;
    const { orders } = orderData;
    const sourceIndex = orders[workflowStatus].filter(item => item._id === orderId);
    const fromStatus = groupedOptions.filter(item => item.id === workflowStatus);
    this.props.updateOrderStatus({
      from: workflowStatus,
      to: e.id,
      orderId,
      destinationIndex: 0,
      sourceIndex: sourceIndex[0].orderIndex,
      toStatusName: e.label,
      fromStatusName: fromStatus[0].label
    });

    if (e.label === "Invoices") {
      if (orderReducer && orderReducer.orderItems && orderReducer.orderItems.isInvoice === false ? true : false) {
        this.props.orderStatus("invoiceStatus", true);
      }
    }
    else {
      if (orderReducer && orderReducer.orderItems && orderReducer.orderItems.isInvoice ? true : false) {
        this.props.orderStatus("invoiceStatus", false);
      }
    }
  };
  handleType1 = (workflowStatus, orderId, groupedOptions, orderStatus) => {
    const { orderReducer } = this.props;
    const { orderData } = orderReducer;
    const { orders } = orderData;
    const sourceIndex = orders[workflowStatus].filter(item => item._id === orderId);
    const fromStatus = groupedOptions.filter(item => item.id === workflowStatus);
    let toStatus = ""
    if (orderStatus === true) {
      toStatus = groupedOptions.filter(item => item.label === "Invoices");
    } else {
      toStatus = groupedOptions.filter(item => item.label === "Estimate")
    }
    this.props.updateOrderStatus({
      from: workflowStatus,
      to: toStatus[0].id,
      orderId,
      destinationIndex: 0,
      sourceIndex: sourceIndex[0].orderIndex,
      toStatusName: toStatus[0].label,
      fromStatusName: fromStatus[0].label
    });
  };

  getScheduleDate = () => {
    const { orderReducer, appointmentReducer } = this.props;
    let scheduleDate = "",
      finalDate = "";
    if (
      orderReducer &&
      orderReducer.orderItems &&
      orderReducer.orderItems.customerId &&
      orderReducer.orderItems.vehicleId &&
      orderReducer.orderItems._id &&
      appointmentReducer &&
      appointmentReducer.data &&
      appointmentReducer.data.length
    ) {
      finalDate = appointmentReducer.data.filter(
        data =>
          moment(data.appointmentDate).format("MMM Do YYYY") >=
          moment(new Date()).format("MMM Do YYYY")
      );
      scheduleDate =
        appointmentReducer && appointmentReducer.data && finalDate[0]
          ? moment(finalDate[0].appointmentDate).format("MMM Do YYYY")
          : null;
    } else {
      scheduleDate = null;
    }
    return (
      <>
        <span id={"dateId"} className={"cursor_pointer pr-1"}>
          {scheduleDate}
        </span>
        <UncontrolledPopover
          target={"dateId"}
          trigger={"hover"}
          placement="bottom"
          className={"border scheduleDate-popover technician-popover"}
        >
          <PopoverHeader>
            <i className={"fa fa-calendar"} /> Scheduled Dates
          </PopoverHeader>
          <PopoverBody className={"bg-light"}>
            {finalDate ? finalDate.map((date, dateIndex) => {
              return (
                <div className={"pt-1 pb-1 border-bottom"} key={dateIndex}>
                  {dateIndex + 1}.{" "}
                  {moment(date.appointmentDate).format("MMM Do YYYY")}
                </div>
              );
            }) : null}
          </PopoverBody>
        </UncontrolledPopover>
      </>
    );
  };
  handleChange = () => {
    this.setState({
      isTextField: !this.state.isTextField
    })
  };
  onInputChange = e => {
    const { target } = e;
    const { name, value } = target;
    this.setState({
      [name]: value,
      errors: {
        ...this.state.errors,
        [name]: null
      }
    });
  };

  render() {
    const {
      orderReducer,
      profileReducer,
      modelInfoReducer,
      modelOperate,
      addPaymentRequest,
      paymentReducer,
      getCustomerData,
      getVehicleData,
      getOrders,
      addAppointment,
      getUserData
    } = this.props;
    const { modelDetails } = modelInfoReducer;
    const { paymentModalOpen, showAddAppointmentModal } = modelDetails;
    const paymentList = paymentReducer.paymentData.length
      ? paymentReducer.paymentData
      : [];
    const payedAmountList =
      paymentList &&
        paymentList.length &&
        paymentList[0].payedAmount &&
        paymentList[0].payedAmount.length
        ? paymentList[0].payedAmount
        : null;
    const { activityLogs, isTextField, poNumber } = this.state;
    const orderData = orderReducer.orderItems ? orderReducer.orderItems : {};
    const createdDate = orderReducer.orderItems
      ? moment(orderReducer.orderItems.createdAt || "").format("MMM Do YYYY LT")
      : "";
    const isInvoice = orderReducer.orderItems
      ? orderReducer.orderItems.isInvoice
      : "";
    const serviceWriter =
      profileReducer.profileInfo.firstName +
      " " +
      profileReducer.profileInfo.lastName;
    const serviceData = orderReducer.orderItems
      ? orderReducer.orderItems.serviceId
      : "";
    let totalParts = 0,
      totalTires = 0,
      totalLabor = 0,
      orderSubTotal = 0,
      orderGandTotal = 0,
      serviceTotalArray,
      totalTax = 0,
      totalDiscount = 0,
      totalPaiedAmount = 0;

    const fleetStatus =
      orderReducer &&
        orderReducer.orderItems &&
        orderReducer.orderItems.customerId &&
        orderReducer.orderItems.customerId.fleet
        ? true
        : false;
    let fleetDiscount =
      orderReducer &&
        orderReducer.orderItems &&
        orderReducer.orderItems.customerId &&
        orderReducer.orderItems.customerId.fleet ? orderReducer.orderItems.customerId.fleet.fleetDefaultPermissions
          .shouldReceiveDiscount.percentageDiscount : 0;

    const orderStatus = orderReducer.orderStatus;
    const groupedOptions = [];
    orderStatus.map((status, index) => {
      return groupedOptions.push({
        label: status.name,
        id: status._id
      });
    });

    const scheduleStatus =
      orderReducer && orderReducer.orderItems && orderReducer.orderItems.customerId
        ? true
        : false;
    const orderItems = orderReducer && orderReducer.orderItems ? orderReducer.orderItems : null;
    let workflowSelected = groupedOptions.filter(
      item => item.id === (orderReducer && orderReducer.orderItems && orderReducer.orderItems.workflowStatus ? orderReducer.orderItems.workflowStatus : "")
    )
    return (
      <div className={"workflow-right"}>
        <div className={""}>
          <div
            className={
              "d-flex justify-content-between pb-2 pl-2 border-bottom order-detail-head"
            }
          >
            <h5 className={"mb-0"}>Order Details</h5>
            <span>
              <h5 className={"mb-0"}>
                {typeof this.props.orderReducer.orderId !== "object"
                  ? `(#${this.props.orderReducer.orderId})`
                  : null}
              </h5>
            </span>
          </div>
          <div
            className={
              "d-flex justify-content-between align-items-center pb-3 pl-2 pt-3"
            }
          >
            <span className={"name-label"}>Service Writer</span>
            <span className={"text-capitalize service-writer"}>
              {serviceWriter}
            </span>
          </div>
          <div
            className={
              "d-flex justify-content-between align-items-center pb-3 pl-2"
            }
          >
            <span className={"name-label"}>Created At</span>
            <span className={"create-date"}>{createdDate}</span>
          </div>
          <div
            className={
              "d-flex justify-content-between align-items-center pb-3 pl-2"
            }
          >
            <span className={"name-label"}>Appointment</span>
            <span className={"create-date"}>
              {this.getScheduleDate() || null}{" "}
              {scheduleStatus ? (
                <>
                  <Button
                    onClick={this.toggleAddAppointModal}
                    color={""}
                    className={"btn btn-sm btn-outline-secondary"}
                    id={"scheduleDate"}
                  >
                    {this.getScheduleDate ? "+ New" : "Schedule"}
                  </Button>
                  <UncontrolledTooltip target={"scheduleDate"}>
                    Schedule a appointment
                  </UncontrolledTooltip>
                </>
              ) : (
                  <>
                    <Button
                      color={""}
                      className={"btn btn-sm btn-outline-secondary"}
                      id={"ScheduleStatus"}
                    >
                      Schedule
                  </Button>
                    <UncontrolledTooltip target={"ScheduleStatus"}>
                      Please update user and vehicle details
                  </UncontrolledTooltip>
                  </>
                )}
            </span>
          </div>
          <div
            className={
              "d-flex justify-content-between align-items -center pb-3 pl-2"
            }
          >
            <span className={"name-label"}>PO Number</span>
            <span className={"create-date"}>
              {poNumber !== "" || isTextField ? (
                isTextField === true ? (
                  <FormGroup>
                    <Input
                      type="text"
                      name="poNumber"
                      value={poNumber ? poNumber : ""}
                      onChange={this.onInputChange}
                      placeholder="Enter PO number"
                    />
                    <div className="d-flex pt-1 ">
                      <Button
                        type="button"
                        className="btn-sm mr-2 update-btn"
                        onClick={() => {
                          this.props.onUpdate("poNumber", poNumber);
                          this.handleChange();
                        }}
                      >
                        Update
                      </Button>
                      <Button
                        type="button"
                        className="btn-sm cancel-btn"
                        onClick={e => this.handleChange()}
                      >
                        Cancel
                      </Button>
                    </div>
                  </FormGroup>
                ) : (
                    <span className={"d-flex"}>
                      <span className={"pr-2 create-date"}>{poNumber}</span>
                      <span>
                        <Button
                          type="button"
                          color={""}
                          className={"btn btn-sm btn-outline-secondary"}
                          onClick={e => this.handleChange()}
                        >
                          Edit
                      </Button>
                      </span>
                    </span>
                  )
              ) : (
                  <Button
                    color={""}
                    className={"btn btn-sm btn-outline-secondary"}
                    onClick={e => this.handleChange()}
                  >
                    + Add
                </Button>
                )}
            </span>
          </div>
          <div
            className={
              "justify-content-between pb-3 pl-2 pt-3 border-top authoris-block align-items-center"
            }
          >
            <div className={"name-label mb-1"}>Authorization</div>
            <ButtonGroup className={"w-100"}>
              {orderItems && !orderItems.status ? (
                <Button
                  color={""}
                  className="btn btn-sm active"
                  onClick={e => this.props.orderStatus("authorizStatus", false)}
                >
                  {orderReducer &&
                    orderReducer.orderItems &&
                    !orderReducer.orderItems.status ? (
                      <span className={"bg-danger authoris-dot"} />
                    ) : (
                      <span className={"bg-secondary authoris-dot"} />
                    )}{" "}
                  Not Authorised
                </Button>
              ) : (
                  <Button
                    color={""}
                    className="btn btn-sm"
                    onClick={e => this.props.orderStatus("authorizStatus", false)}
                  >
                    {orderReducer &&
                      orderReducer.orderItems &&
                      !orderReducer.orderItems.status ? (
                        <span className={"bg-danger authoris-dot"} />
                      ) : (
                        <span className={"bg-secondary authoris-dot"} />
                      )}{" "}
                    Not Authorised
                </Button>
                )}

              {/* <Button
                color={""}
                className={
                   orderItems 
                    ?(orderItems.status === false)? "btn btn-sm active"
                    : "btn btn-sm":"btn btn-sm"
                }
                onClick={e => this.props.orderStatus("authorizStatus", false)}
              >
                {orderReducer && !orderReducer.orderItems.status ? (
                  <span className={"bg-danger authoris-dot"} />
                ) : (
                    <span className={"bg-secondary authoris-dot"} />
                  )}{" "}
                Not Authorised
              </Button> */}
              {orderItems && !orderItems.status ? (
                <Button
                  color={""}
                  className={"btn btn-sm"}
                  onClick={e => this.props.orderStatus("authorizStatus", true)}
                >
                  {orderReducer &&
                    orderReducer.orderItems &&
                    orderReducer.orderItems.status ? (
                      <span className={"bg-success authoris-dot"} />
                    ) : (
                      <span className={"bg-secondary authoris-dot"} />
                    )}{" "}
                  Authorised
                </Button>
              ) : (
                  <Button
                    color={""}
                    className={"btn btn-sm active"}
                    onClick={e => this.props.orderStatus("authorizStatus", true)}
                  >
                    {orderReducer &&
                      orderReducer.orderItems &&
                      orderReducer.orderItems.status ? (
                        <span className={"bg-success authoris-dot"} />
                      ) : (
                        <span className={"bg-secondary authoris-dot"} />
                      )}{" "}
                    Authorised
                </Button>
                )}
            </ButtonGroup>
          </div>
          <div
            className={
              "justify-content-between pb-3 pl-2 authoris-block align-items-center"
            }
          >
            <span className={"name-label mb-1"}>Order Status</span>

            <ButtonGroup className={"w-100"}>
              <Button
                color={""}
                className={!isInvoice ? "btn btn-sm active" : "btn btn-sm"}
                onClick={e => {
                  this.props.orderStatus("invoiceStatus", false);
                  this.handleType1(
                    orderReducer.orderItems.workflowStatus,
                    orderReducer.orderItems._id,
                    groupedOptions,
                    false
                  )
                }
                }
              >
                Estimate
              </Button>
              <Button
                color={""}
                className={isInvoice ? "btn btn-sm active" : "btn btn-sm"}
                onClick={e => {
                  this.props.orderStatus("invoiceStatus", true);
                  this.handleType1(
                    orderReducer.orderItems.workflowStatus,
                    orderReducer.orderItems._id,
                    groupedOptions,
                    true
                  )
                }
                }
              >
                Invoice
              </Button>
            </ButtonGroup>
          </div>
          <div
            className={
              "justify-content-between pb-3 pl-2 fleet-block align-items-center"
            }
          >
            <div className={"name-label mb-1"}>Workflow</div>
            <Select
              defaultValue={workflowSelected ? workflowSelected : ""}
              value={workflowSelected ? workflowSelected : ""}
              options={groupedOptions}
              className="form-select simple-select"
              onChange={e =>
                this.handleType(
                  e,
                  orderReducer.orderItems.workflowStatus,
                  orderReducer.orderItems._id,
                  groupedOptions
                )
              }
              classNamePrefix={"form-select-theme"}
            />
          </div>
        </div>
        <div className={"service-warp border-top pt-2 mt-1"}>
          {serviceData && serviceData.length
            ? serviceData.map((item, index) => {
              let mainserviceTotal = [],
                serviceTotal,
                epa,
                discount,
                tax;
              return (
                <div key={index} className={""}>
                  {item.serviceId &&
                    item.serviceId.serviceItems &&
                    item.serviceId.serviceItems.length
                    ? item.serviceId.serviceItems.map((service, sIndex) => {
                      const calSubTotal = calculateSubTotal(
                        service.retailPrice ||
                        (service.tierSize && service.tierSize.length
                          ? service.tierSize[0].retailPrice
                          : null) ||
                        0,
                        service.qty || 0,
                        service.hours || 0,
                        service.rate ? service.rate.hourlyRate : 0
                      ).toFixed(2);
                      const subDiscount = calculateValues(
                        calSubTotal || 0,
                        service.discount.value || 0,
                        service.discount.type
                      );
                      const servicesSubTotal = (
                        parseFloat(calSubTotal) - parseFloat(subDiscount)
                      ).toFixed(2);
                      mainserviceTotal.push(parseFloat(servicesSubTotal));
                      serviceTotalArray = getSumOfArray(mainserviceTotal);
                      epa = calculateValues(
                        serviceTotalArray || 0,
                        item.serviceId.epa.value || 0,
                        item.serviceId.epa ? item.serviceId.epa.type : "$"
                      );
                      discount = calculateValues(
                        serviceTotalArray || 0,
                        item.serviceId.discount.value || 0,
                        item.serviceId.discount
                          ? item.serviceId.discount.type
                          : "$"
                      );
                      tax = calculateValues(
                        serviceTotalArray || 0,
                        item.serviceId.taxes.value || 0,
                        item.serviceId.taxes
                          ? item.serviceId.taxes.type
                          : "$"
                      );

                      serviceTotal = (
                        parseFloat(serviceTotalArray) +
                        parseFloat(epa) +
                        parseFloat(tax) -
                        parseFloat(discount)
                      ).toFixed(2);
                      if (service.serviceType === "part") {
                        totalParts += parseFloat(servicesSubTotal);
                      }
                      if (service.serviceType === "tire") {
                        totalTires += parseFloat(servicesSubTotal);
                      }
                      if (service.serviceType === "labor") {
                        totalLabor += parseFloat(servicesSubTotal);
                      }
                      orderSubTotal += parseFloat(servicesSubTotal);

                      return true;
                    })
                    : ""}
                  <span className={"d-none"}>
                    {
                      ((orderGandTotal += parseFloat(serviceTotal) || 0),
                        fleetStatus
                          ? (fleetDiscount = calculateValues(
                            orderGandTotal,
                            fleetDiscount,
                            "%"
                          ))
                          : 0,
                        fleetStatus
                          ? (orderGandTotal = orderGandTotal - fleetDiscount)
                          : 0)
                    }
                  </span>

                  <span className={"d-none"}>
                    {(totalTax += parseFloat(epa) + parseFloat(tax) || 0)}
                  </span>
                  <span className={"d-none"}>
                    {(totalDiscount += parseFloat(discount) || 0)}
                  </span>
                </div>
              );
            })
            : ""}
          {paymentList && paymentList.length
            ? paymentList.map(paymentData => {
              totalPaiedAmount +=
                paymentData.payedAmount[paymentData.payedAmount.length - 1]
                  .amount;
              return true;
            })
            : null}
          {serviceData && serviceData.length ? (
            <>
              <div
                className={"w-100 text-right pull-right pr-2 order-total-block"}
              >
                <div>
                  <span className={"title"}>Total Parts </span>:{" "}
                  <span className={"price-block"}>
                    <Dollor value={totalParts.toFixed(2) >= 0 ? totalParts.toFixed(2) : 0} />
                  </span>
                </div>
                <div>
                  <span className={"title"}>Total Tires </span>:{" "}
                  <span className={"price-block"}>
                    <Dollor value={totalTires.toFixed(2) >= 0 ? totalTires.toFixed(2) : 0} />
                  </span>
                </div>
                <div>
                  <span className={"title"}>Total Labor </span>:{" "}
                  <span className={"price-block"}>
                    <Dollor value={totalLabor.toFixed(2) >= 0 ? totalLabor.toFixed(2) : 0} />
                  </span>
                </div>
                <div className={"pt-2 border-top mt-2"}>
                  <span className={"title"}>Sub Total </span>:{" "}
                  <span className={"price-block"}>
                    <Dollor value={orderSubTotal.toFixed(2) >= 0 ? orderSubTotal.toFixed(2) : 0} />
                  </span>
                </div>
                <div>
                  <span className={"title"}>Total Tax </span>:
                  <span className={"price-block"}>
                    +{" "}
                    <Dollor
                      value={!isNaN(totalTax) ? totalTax.toFixed(2) : 0.0}
                    />
                  </span>
                </div>
                <div>
                  <span className={"title"}>Total Discount </span>:{" "}
                  <span className={"price-block"}>
                    -{" "}
                    <Dollor
                      value={
                        !isNaN(totalDiscount) ? totalDiscount.toFixed(2) : 0.0
                      }
                    />
                  </span>
                </div>
                {fleetStatus ? (
                  <div className={"border-top pt-2 mt-2"}>
                    <span className={"title"}>Fleet Discount </span>:{" "}
                    <span className={"price-block"}>
                      - <Dollor value={fleetDiscount.toFixed(2)} />
                    </span>
                  </div>
                ) : null}
                <div className={"pt-2 border-top mt-2 grand-total"}>
                  Grand Total :{" "}
                  <Dollor
                    value={
                      !isNaN(orderGandTotal) ? orderGandTotal.toFixed(2) : 0.0
                    }
                  />
                </div>
                <div className={"pt-2"}>
                  Total Paid Amount :{" "}
                  <Dollor value={parseFloat(totalPaiedAmount).toFixed(2)} />
                </div>
              </div>
              <div className={"clearfix"} />
            </>
          ) : (
              ""
            )}
        </div>
        <hr />
        <div className={"text-center payment-section"}>
          <h6
            className={
              orderGandTotal - totalPaiedAmount === 0
                ? "text-success"
                : "text-dark"
            }
          >
            Remaining Balance{" "}
            <Dollor
              value={parseFloat(orderGandTotal - totalPaiedAmount).toFixed(2)}
            />
          </h6>
          <Button
            size={"sm"}
            onClick={this.handlePaymentModal}
            className={"btn btn-theme"}
          >
            New Payment
          </Button>
        </div>
        <div className={"activity-logs"}>
          {paymentList && paymentList.length ? (
            <h5 className={"mb-2 p-2 text-left"}>Payments</h5>
          ) : null}
          {paymentList && paymentList.length
            ? paymentList
              .slice(0)
              .reverse()
              .map((paymentData, pIndex) => {
                return (
                  <div key={pIndex} className={"activity-block p-3"}>
                    <div className={"pr-3 text-left"}>
                      <span>{`Paid $${
                        paymentData.payedAmount[
                          paymentData.payedAmount.length - 1
                        ].amount
                          ? paymentData.payedAmount[
                            paymentData.payedAmount.length - 1
                          ].amount.toFixed(2)
                          : 0
                        } viea ${paymentData.paymentType} on date`}</span>
                    </div>
                    <div className={"text-left activity-date"}>
                      <span>
                        {moment(
                          paymentData.payedAmount[
                            paymentData.payedAmount.length - 1
                          ].date
                        ).format("MMM Do YYYY, h:mm A")}
                      </span>
                    </div>
                    <span className={"activity-icon payment-set"}>
                      <i className={"fa fa-dollar-sign"} />
                    </span>
                  </div>
                );
              })
            : null}
        </div>
        <hr />
        <div className={"activity-logs"}>
          {activityLogs && activityLogs.length ? (
            <h5 className={"mb-2 p-2 text-left"}>Activity</h5>
          ) : null}
          {activityLogs && activityLogs.length
            ? activityLogs
              .slice(0)
              .reverse()
              .map((activity, index) => {
                let dateA = moment(activity.createdAt).format("L");
                let dateB = moment().format("L");
                let dayDiff = moment(dateB).diff(moment(dateA), "days");
                return (
                  <div key={index} className={"activity-block p-3"}>
                    <div className={"pr-3 text-left"}>
                      <span className="text-capitalize">
                        {activity.activityPerson.firstName}{" "}
                        {activity.activityPerson.lastName}{" "}
                        {activity.type !== "NEW_ORDER" &&
                          activity.type !== "ADD_PAYMENT" &&
                          activity.type !== "NEW_MESSAGE" &&
                          activity.type !== "UPDATE_STATUS"
                          ? "changed"
                          : null}{" "}
                        {activity.name}
                      </span>
                    </div>
                    <div className={"text-left activity-date"}>
                      <span>
                        {dayDiff >= 1
                          ? moment(activity.createdAt).format(
                            "MMM Do YYYY, h:mm A"
                          )
                          : moment(activity.createdAt)
                            .startOf("seconds")
                            .fromNow()}
                      </span>
                    </div>
                    <span
                      className={
                        activity.type === "NEW_MESSAGE"
                          ? "activity-icon activity-message"
                          : "activity-icon activity-set"
                      }
                    >
                      {activity.type !== "NEW_ORDER" &&
                        activity.type !== "ADD_PAYMENT" &&
                        activity.type !== "INVOICE_ORDER" &&
                        activity.type !== "UPDATE_STATUS" &&
                        activity.type !== "NEW_MESSAGE" ? (
                          <i className={"fa fa-check"} />
                        ) : null}
                      {activity.type === "ADD_PAYMENT" ? (
                        <i className={"fa fa-dollar-sign"} />
                      ) : null}
                      {activity.type === "NEW_MESSAGE" ? (
                        <i className="fas fa-bars mt-1" />
                      ) : null}
                    </span>
                  </div>
                );
              })
            : ""}
        </div>

        <CrmPaymentModel
          openPaymentModel={paymentModalOpen}
          handlePaymentModal={this.handlePaymentModal}
          payableAmmount={orderGandTotal}
          modelDetails={modelDetails}
          modelOperate={modelOperate}
          isPaymentChange={false}
          profileReducer={profileReducer}
          orderReducer={orderReducer}
          payedAmountList={payedAmountList}
          addPaymentRequest={addPaymentRequest}
          totalPaiedAmount={totalPaiedAmount}
        />
        <AddAppointment
          isOpen={showAddAppointmentModal}
          toggleAddAppointModal={this.toggleAddAppointModal}
          getCustomerData={getCustomerData}
          getVehicleData={getVehicleData}
          date={new Date()}
          getOrders={getOrders}
          addAppointment={addAppointment}
          editData={""}
          orderData={orderData}
          getUserData={getUserData}
        />
        <div>
          {/* {
           activeService ?
            () => this.props.handlePDF(
              totalParts,
              totalTires,
              totalLabor,
              orderSubTotal,
              orderGandTotal,
              serviceTotalArray,
              totalTax,
              totalDiscount,
              serviceData
            ) : null
        } */}
        </div>
      </div>
    );
  }
}

export default OrderDetails;
