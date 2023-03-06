import React from "react";
import { Link } from "react-router-dom";
import {
  Table, Nav, NavItem, NavLink, UncontrolledTooltip, DropdownItem,
  DropdownToggle,
  DropdownMenu,
  Dropdown,
  Input,
  FormFeedback
} from "reactstrap";
import Loader from "../../containers/Loader/Loader";
import NoDataFound from "../common/NoFound";
import { AppRoutes } from "../../config/AppRoutes";
import serviceUser from "../../assets/service-user.png";
import serviceTyre from "../../assets/service-car.png";
import { serviceTotalsCalculation } from "../../helpers";
import Dollor from "../common/Dollor";
import Select from "react-select";
import moment from "moment";
import { ConfirmBox } from "../../helpers/SweetAlert";
import AddAppointment from "../Appointments/AddAppointment";
import AppointmentDetails from "../Appointments/AppointmentDetails";
import "./index.scss"

class WorkflowListView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: null,
      appointModalOpen: false,
      orderUserData: {},
      orderAppointment: [],
      showAppointmentDetailModal: false,
      appointmentDetail: "",
      openAction: [],
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

  getAppointmentDetails = (id, task) => {
    const reducerData = this.props.appointmentReducer;
    const orders = reducerData.data.filter(order => order.orderId);
    let orderDetails = "";
    const orderMain = orders.filter(orderName => orderName.orderId._id === id);

    if (orderMain.length) {
      var day = orderMain.length;
      orderDetails = (
        <>
          <span
            className={"pr-2 text-dark cursor_pointer"}
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
            className={"pr-2 text-dark cursor_pointer"}
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

  handleType = (e, workflowStatus, orderId, index, groupedOptions) => {
    const fromStatus = groupedOptions.filter(item => item.id === workflowStatus)
    this.props.updateOrderStatus({
      from: workflowStatus,
      to: e.id,
      orderId,
      destinationIndex: 0,
      sourceIndex: index,
      toStatusName: e.label,
      fromStatusName: fromStatus[0].label
    });
    if (e.label === "Invoices") {
      this.props.orderStatus1("invoiceStatus", true);
    }
    else {
      this.props.orderStatus1("invoiceStatus", false)
    }
  };
  /**
   *
   */
  renderRow = (order, index) => {
    const { activeTab } = this.state;
    let serviceCalculation = {};
    serviceCalculation = serviceTotalsCalculation(order.serviceId);
    const { orderStatus } = this.props;
    const groupedOptions = [];
    orderStatus.map((status, index) => {
      return groupedOptions.push({ label: status.name, id: status._id });
    });
    const statusValue = groupedOptions.filter(
      item => item.id === order.workflowStatus
    );
    return (
      <tr key={index}>
        <td className={""} width={200}>
          <div
            onClick={() =>
              this.props.redirectTo(
                `${AppRoutes.WORKFLOW_ORDER.url.replace(":id", order._id)}`
              )
            }
            className={"order-title"}
          >
            <div className={"order-id"}>
              <span className={"pr-2"}>
                {order.isInvoice ? "Invoice" : "Estimate"}
              </span>
              #{order.orderId || "---"}
            </div>

            {order.orderName || "Unnamed order"}
          </div>
        </td>

        <td width={220}>
          <div className={"d-flex"} >
            <img
              src={serviceUser}
              alt={"serviceUser"}
              width={"20"}
              height={"20"}
              className={"mr-1"}
            />
            {order && order.customerId
              ? <Link to={AppRoutes.CUSTOMER_DETAILS.url.replace(":id", order.customerId._id)} target="_blank"
                className={
                  "cursor_pointer text-primary text-capitalize"
                }>
                {order.customerId.firstName + " " + order.customerId.lastName}
              </Link>
              : "No Customer"}
          </div>
        </td>
        <td>
          <div className={"d-flex"}>
            <img
              src={serviceTyre}
              alt={"serviceTyre"}
              width={"20"}
              height={"20"}
              className={"mr-1"}
            />
            {order && order.vehicleId
              ? <Link to={AppRoutes.VEHICLES_DETAILS.url.replace(":id", order.vehicleId._id)} taget="_blank"
                className={
                  "cursor_pointer text-primary text-capitalize"
                }>
                {order.vehicleId.make + " " + order.vehicleId.modal}
              </Link>
              : "No Vehicle"}
          </div>
        </td>
        <td className={"pl-2"}>
          <Dollor value={serviceCalculation.orderGrandTotal} />
        </td>
        <td width={200} className={"fleet-block"}>
          <Select
            value={statusValue[0]}
            options={groupedOptions}
            className="w-100 form-select simple-select"
            onChange={e =>
              this.handleType(
                e,
                order.workflowStatus,
                order._id,
                index,
                groupedOptions
              )
            }
            classNamePrefix={"form-select-theme"}
          />
        </td>

        <td>
          <span
            className={
              order.status
                ? "status-btn border-success text-success"
                : "status-btn"
            }
          >
            <i
              className={
                order.status
                  ? "fas fa-check text-success"
                  : "fas fa-check text-secondary"
              }
            />{" "}
            {order.status ? "Authorised" : "Not Authorised"}
          </span>
        </td>
        <td width={80} className={"text-center"}>
          {this.getAppointmentDetails(order._id, order)}
        </td>
        <td className={"delete-icon text-center"}>
          <i
            className={"fa fa-trash"}
            onClick={() =>
              this.props.deleteOrder({
                statusId: activeTab,
                id: order._id,
                index
              })
            }
            id={`delete-${order._id}`}
          />
          <UncontrolledTooltip target={`delete-${order._id}`}>
            Delete Order
          </UncontrolledTooltip>
        </td>
      </tr>
    );
  };
  toggleOpenAction = ind => {
    const { openAction } = this.state;
    openAction.forEach(d => (d = false));
    openAction[ind] = !openAction[ind];
    this.setState({
      openAction
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
        <DropdownToggle nav className="listView-Delete listView">
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
  /**
   *
   */

  render() {
    const { orderStatus, orderData, addAppointment } = this.props;
    const { orders, isLoading } = orderData;
    let { activeTab } = this.state;
    const {
      appointModalOpen,
      orderUserData,
      showAppointmentDetailModal,
      appointmentDetail,
      isEdit,
      orderStatusName,
      errors
    } = this.state;
    if (!activeTab && orderStatus[0]) {
      activeTab = orderStatus[0]._id;
    }

    return (
      <div>
        <Nav pills className={"inventory-nav workflow-list-tab"}>
          {orderStatus
            ? orderStatus.map((tab, index) => {
              return (
                <NavItem key={index}>
                  <NavLink
                    href={tab.url}
                    active={tab._id === activeTab}
                    onClick={e => {
                      e.preventDefault();
                      this.setState({
                        activeTab: tab._id
                      });
                    }}
                  >
                    <div className="d-flex align-items-center m-0 justify-content-between">
                      {isEdit === true && this.state.index === index ?
                      <div className={"input-block"}>
                        <Input
                          type="text"
                          name="orderStatusName"
                          value={orderStatusName}
                          onChange={this.handleInputChange}
                          onBlur={() => this.onBlur(orderStatusName, index, tab._id)} 
                          invalid={errors.orderStatusName ? true : false}
                          /> 
                          <FormFeedback>
                            {errors.orderStatusName ? errors.orderStatusName : null}
                          </FormFeedback>
                          </div>
                          : <div>{tab.name}</div>}
                      <div>
                        {this.renderActions(tab, index)}
                      </div>
                    </div>
                  </NavLink>
                </NavItem>
              );
            })
            : null}
        </Nav>
        <div className={"table-responsive"}>
          <Table className={"workflow-table"}>
            <thead>
              <tr>
                <th>Order Details</th>
                <th>Customer Details</th>
                <th>Vehicle Details</th>
                <th>Order Total</th>
                <th>Status</th>
                <th width={""}>Invoice</th>
                <th>Appointments</th>
                <th className={"text-center"}>Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td>
                    <Loader />
                  </td>
                </tr>
              ) : orders && orders[activeTab] && orders[activeTab].length ? (
                orders[activeTab].map(this.renderRow)
              ) : (
                    <tr>
                      <td className={"text-center"} colSpan={8}>
                        <NoDataFound />
                      </td>
                    </tr>
                  )}
            </tbody>
          </Table>
        </div>
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
      </div>
    );
  }
}

export default WorkflowListView;
