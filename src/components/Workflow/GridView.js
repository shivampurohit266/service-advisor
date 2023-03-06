import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import React from "react";
import moment from "moment";
import {
  DropdownItem,
  DropdownToggle,
  DropdownMenu,
  Dropdown,
  Row,
  Col,
  UncontrolledTooltip,
  Input,
  FormFeedback
} from "reactstrap";

// import { logger } from "../../helpers/Logger";
import Loader from "../../containers/Loader/Loader";
import { AppRoutes } from "../../config/AppRoutes";
import serviceUser from "../../assets/service-user.png";
import serviceTyre from "../../assets/service-car.png";
import { serviceTotalsCalculation } from "../../helpers";
import AddAppointment from "../Appointments/AddAppointment";
import AppointmentDetails from "../Appointments/AppointmentDetails";
import { ConfirmBox } from "../../helpers/SweetAlert";

import Dollor from "../common/Dollor";

class WorkflowGridView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openAction: [],
      appointModalOpen: false,
      orderUserData: {},
      orderAppointment: [],
      showAppointmentDetailModal: false,
      appointmentDetail: "",
      isEdit: false,
      index: -1,
      orderStatusName: "",
      errors: {}
    };
  }

  componentDidMount = () => {
    this.props.getAppointments({
      technicianId: null,
      vehicleId: null,
      orderId: null
    });
  };

  componentDidUpdate = () => { };

  handleOrderDetails = orderId => {
    this.props.redirectTo(
      `${AppRoutes.WORKFLOW_ORDER.url.replace(":id", orderId)}`
    );
  };
  /*
  /*  
  */
  handleVehicleDetails = vehicleId => {
    this.props.redirectTo(
      `${AppRoutes.VEHICLES_DETAILS.url.replace(":id", vehicleId)}`
    );
  };
  /*
  /*  
  */
  handleCustomerDetails = customerId => {
    this.props.redirectTo(
      AppRoutes.CUSTOMER_DETAILS.url.replace(":id", `${customerId}`)
    );
  };
  /*
  /*  
  */
  toggleAppointmentDetails = (e, details) => {
    const { showAppointmentDetailModal } = this.state;
    this.setState({
      showAppointmentDetailModal: !showAppointmentDetailModal,
      appointmentDetail: details || {}
    });
  };

  getAppointmentDetails = (id, task) => {
    const reducerData = this.props.appointmentReducer;
    const orders = reducerData && reducerData.data ? reducerData.data.filter(order => order.orderId) : null;
    let orderDetails = "";
    const orderMain = orders && orders.length ? orders.filter(orderName => orderName.orderId._id === id) : "";

    if (orderMain.length) {
      var day = orderMain.length;
      orderDetails = (
        <>
          <span
            className={"pr-2 text-dark"}
            onClick={e => this.toggleAppointmentDetails(e, orderMain[0])}
          >
            <span className={"text-success"} id={`appoint-status-${id}`}>
              <i className="fa fa-calendar" />
            </span>
            <UncontrolledTooltip target={`appoint-status-${id}`}>
              Schedule on
              <br />
              {moment(orderMain[day > 0 ? day - 1 : 0].appointmentDate).format(
                "MMM Do YYYY"
              )}
            </UncontrolledTooltip>
          </span>
        </>
      );
    } else {
      orderDetails = (
        <>
          <span
            className={"pr-2 text-dark"}
            onClick={e => this.toggleAddAppointModal(e, task)}
          >
            <span className={""} id={`appoint-status-${id}`}>
              <i className="fa fa-calendar" />
            </span>
            <UncontrolledTooltip target={`appoint-status-${id}`}>
              Click to schedule appointment
            </UncontrolledTooltip>
          </span>
        </>
      );
    }
    return orderDetails;
  };

  onDragEnd = result => {
    const { destination, source, draggableId: orderId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      source.index === destination.index
    ) {
      return;
    }
    if (result.type === "droppableItem") {
      this.props.updateOrderOfOrderStatus({
        from: {
          index: parseInt(source.index),
          id: this.props.orderStatus[source.index]._id
        },
        to: {
          index: parseInt(destination.index),
          id: this.props.orderStatus[destination.index]._id
        }
      });
      return;
    }
    let toStatus = "";
    let fromStatus = "";
    if (this.props.orderStatus) {
      toStatus = this.props.orderStatus.filter(item => item._id === destination.droppableId);
      fromStatus = this.props.orderStatus.filter(item => item._id === source.droppableId)
    }
    this.props.updateOrderStatus({
      from: source.droppableId,
      to: destination.droppableId,
      orderId,
      destinationIndex: destination.index,
      sourceIndex: source.index,
      toStatusName: toStatus[0].name,
      fromStatusName: fromStatus[0].name
    });
    if (toStatus[0].name === "Invoices") {
      this.props.orderStatus1("invoiceStatus", true, orderId);
    }
    else {
      this.props.orderStatus1("invoiceStatus", false, orderId)
    }
  };
  /**
   *
   */
  toggleOpenAction = ind => {
    const { openAction } = this.state;
    openAction.forEach(d => (d = false));
    openAction[ind] = !openAction[ind];
    this.setState({
      openAction
    });
  };
  /** */
  toggleAddAppointModal = async (e, task) => {
    if (task && !task.customerId) {
      await ConfirmBox({
        text: "",
        title: "Order doesn't have customer information",
        showCancelButton: false,
        confirmButtonText: "Ok"
      });
      return;
    }
    const { appointModalOpen } = this.state;
    this.setState({
      appointModalOpen: !appointModalOpen,
      orderUserData: task
    });
  };
  /**
   *
   */
  renderActions = (status, ind) => {
    return (
      <Dropdown
        direction="down"
        isOpen={this.state.openAction[ind]}
        toggle={() => {
          this.toggleOpenAction(ind);
        }}
      >
        <DropdownToggle nav>
          <i className="fas fa-ellipsis-h icon" />
        </DropdownToggle>
        <DropdownMenu right>
          <DropdownItem
            onClick={() =>
              this.props.deleteOrderStatus({
                orderStatusId: status._id,
                index: ind
              })
            }
          >
            Delete
          </DropdownItem>
          <DropdownItem
            onClick={() => {
              this.setState({
                isEdit: true,
                index: ind,
                orderStatusName: status.name
              })
            }}>
            Edit
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    );
  };

  renderOrders = (status, tasks, orders, isLoading) => {
    let serviceCalculation = [];
    if (orders[status._id] && orders[status._id].length) {
      orders[status._id].map((task, index) => {
        if (task.serviceId && task.serviceId.length) {
          serviceCalculation.push(serviceTotalsCalculation(task.serviceId));
        } else {
          serviceCalculation.push({ 'orderGrandTotal': 0 })
        }
        return true;
      });
    }
    return (
      <Droppable droppableId={status._id}>
        {provided => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {tasks.map((task, index) => (
              <React.Fragment key={task._id}>
                <Draggable draggableId={task._id} index={index}>
                  {/* {task.serviceId ?
                    serviceCalculation = serviceTotalsCalculation(task.serviceId) : null
                  } */}
                  {providedNew => (
                    <div
                      {...providedNew.draggableProps}
                      {...providedNew.dragHandleProps}
                      ref={providedNew.innerRef}
                      className={"content"}
                    >
                      <div className={"content-inner"}>
                        <div
                          onClick={() => {
                            this.props.redirectTo(
                              `${AppRoutes.WORKFLOW_ORDER.url.replace(
                                ":id",
                                task._id
                              )}`
                            );
                          }}
                        >
                          <h5 className={"mb-0 "}>
                            <span>
                              {task.orderId ? `(#${task.orderId})` : null}
                            </span>
                            {"  "}
                            <span>{task.orderName || "Unnamed order"}</span>
                          </h5>

                          <div className={"content-title"}>
                            <span>
                              <img
                                src={serviceUser}
                                alt={"serviceUser"}
                                width={"18"}
                                height={"18"}
                              />
                            </span>
                            <span className={"text"}>
                              {"  "}
                              {task.customerId
                                ? `${task.customerId.firstName} ${" "} ${
                                task.customerId.lastName
                                }`
                                : "No Customer"}
                            </span>{" "}
                          </div>
                          <div className={"content-title"}>
                            <span>
                              <img
                                src={serviceTyre}
                                alt={"serviceUser"}
                                width={"18"}
                                height={"18"}
                              />
                            </span>
                            <span className={"text"}>
                              {"  "}
                              {task.vehicleId
                                ? `${task.vehicleId.make} ${" "} ${
                                task.vehicleId.modal
                                }`
                                : "No Vehicle"}
                            </span>
                          </div>
                        </div>
                        <span
                          className={"delete-icon"}
                          id={`delete-${task._id}`}
                        >
                          <i
                            className={"fa fa-trash pull-right"}
                            onClick={() => {
                              this.props.deleteOrder({
                                statusId: status._id,
                                index,
                                id: task._id
                              });
                            }}
                          />
                        </span>
                        <UncontrolledTooltip target={`delete-${task._id}`}>
                          Delete Order
                        </UncontrolledTooltip>
                        <div
                          className={"pt-2 position-relative cursor_pointer"}
                        >
                          <div className={"service-total"}>
                            <span className={"pr-1"}>Total:</span>
                            <Dollor
                              value={
                                serviceCalculation[index]
                                  ? serviceCalculation[index].orderGrandTotal
                                  : 0
                              }
                            />
                          </div>
                          <span
                            className={"pr-3"}
                            id={`authorised-status-${task._id}`}
                          >
                            <i
                              className={
                                task.status
                                  ? "fas fa-check text-success"
                                  : "fas fa-check text-muted"
                              }
                            />
                          </span>
                          <UncontrolledTooltip
                            target={`authorised-status-${task._id}`}
                          >
                            {task.status ? "Authorised" : "Not Authorised"}
                          </UncontrolledTooltip>

                          {this.getAppointmentDetails(task._id, task)}
                          {task.serviceId && task.serviceId.length ? (
                            <span className={""}>
                              {task.isFullyPaid ? (
                                <span className="pl-3 text-success">
                                  Fully Paid
                                </span>
                              ) : null}
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  )}
                </Draggable>
              </React.Fragment>
            ))}
            {isLoading ? <Loader /> : provided.placeholder}
          </div>
        )}
      </Droppable>
    );
  };
  /**
   * 
   */
  onBlur = (orderStatusName, index, id) => {
    if(orderStatusName.trim().length < 1){
      this.setState({
        errors:{
          ...this.state.errors,
          orderStatusName:"Please enter workflow status name."
        }
      })
      return ;
    }
    this.props.updateOrderStatusName(orderStatusName.trim(), index,id)
    this.setState({
      isEdit: false,
      index: -1
    })
  }
  /**
   * 
   */
  handleInputChange = e => {
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
  /**
   *
   */
  render() {
    const { orderStatus, orderData, addAppointment } = this.props;
    const { orders, isLoading } = orderData;
    const {
      appointModalOpen,
      orderUserData,
      showAppointmentDetailModal,
      appointmentDetail,
      isEdit,
      orderStatusName,
      errors
    } = this.state;

    return (
      <>
        <DragDropContext
          onDragEnd={this.onDragEnd}
        >
          <Droppable
            droppableId={`dropableId`}
            type="droppableItem"
            direction={"horizontal"}
            internalScroll
          >
            {provided => (
              <div
                ref={provided.innerRef}
                style={{
                  width: `${320 * orderStatus.length}px`
                }}
                className={"workflow-grid-card-warp"}
              >

                {orderStatus.map((status, index) => (
                  <React.Fragment key={status._id}>
                    <Draggable draggableId={status._id} index={index}>
                      {provided => (
                        <>
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={"workflow-grid-card"}
                          >
                            <div
                              {...provided.dragHandleProps}
                              className={"title"}
                            >
                              <Row className={"m-0"}>
                                <Col sm={"12"}>
                                  <div className={"workflow-heads"}>
                                    {isEdit === true && this.state.index === index ?
                                    <div className={"input-block"}>
                                      <Input
                                        type="text"
                                        name="orderStatusName"
                                        value={orderStatusName}
                                        onChange={this.handleInputChange}
                                        onBlur={() => this.onBlur(orderStatusName, index, status._id)} 
                                        invalid={errors.orderStatusName ? true : false}
                                        />
                                        <FormFeedback>
                                       {errors.orderStatusName ? errors.orderStatusName : null}
                                       </FormFeedback> 
                                    </div>
                                    : <h5>{status.name}</h5>}
                                    <span>
                                      {this.renderActions(status, index)}
                                    </span>
                                  </div>
                                </Col>
                              </Row>
                            </div>
                            {this.renderOrders(
                              status,
                              orders[status._id] || [],
                              orders,
                              isLoading
                            )}
                          </div>
                          {provided.placeholder}
                        </>
                      )}
                    </Draggable>
                  </React.Fragment>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        <AddAppointment
          isOpen={appointModalOpen}
          toggleAddAppointModal={this.toggleAddAppointModal}
          date={new Date()}
          editData={""}
          orderData={orderUserData}
          addAppointment={addAppointment}
        />

        <AppointmentDetails
          isOpen={showAppointmentDetailModal}
          toggle={this.toggleAppointmentDetails}
          isLoading={false}
          data={appointmentDetail}
          // toggleEditAppointModal={this.toggleEditAppointModal}
          orderClick={this.handleOrderDetails}
          onCustomerClick={this.handleCustomerDetails}
          onVehicleClick={this.handleVehicleDetails}
          isTechnicianData={true}
        />
      </>
    );
  }
}

export default WorkflowGridView;
