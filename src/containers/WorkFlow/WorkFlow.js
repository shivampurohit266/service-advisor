import {
  Col,
  Row,
  Card,
  CardBody,
  Button,
  Input,
  Label,
  FormGroup,
  DropdownItem,
  DropdownToggle,
  DropdownMenu,
  Dropdown,
  InputGroup,
  FormFeedback,
  UncontrolledTooltip
} from "reactstrap";
import { connect } from "react-redux";
import React, { Component } from "react";
import WorkflowGridView from "../../components/Workflow/GridView";

import {
  getOrderList,
  updateOrderStatus,
  deleteOrderStatusRequest,
  addOrderStatus,
  updateOrderOfOrderStatus,
  addOrderRequest,
  deleteOrderRequest,
  getAppointments,
  addAppointmentRequest,
  updateOrderDetailsRequest,
  updateOrderStatusNameReq
} from "../../actions";
// import { logger } from "../../helpers/Logger";
import CRMModal from "../../components/common/Modal";
import { toast } from "react-toastify";
import Validator from "js-object-validation";
import {
  AddOrderStatusValidation,
  AddOrderStatusMessages
} from "../../validations";
import qs from "query-string";
import { AppRoutes } from "../../config/AppRoutes";

import * as classNames from "classnames";
import WorkflowListView from "../../components/Workflow/ListView";
import { ConfirmBox } from "../../helpers/SweetAlert";
import ResizeObserver from "react-resize-observer";

let pos3 = 0, pos1 = 0;
let toastId = null;

class WorkFlow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showMoveOptions: false,
      selectedOrderStatusToDelete: {},
      newStatus: null,
      showAddNewOptions: false,
      orderStatusName: "",
      selectedFilter: "",
      errors: {
        orderStatusName: null
      },
      listView: false,
      mousedown: false,
      divX: 0,
      divY: 0,
      trackWidth: 0,
      scrollToWidth: 0,
      scrollPos: 50,
      scrollToFixed: false
    };
  }

  /**
   *
   */
  handleOrder = () => {
    this.props.addOrderRequest();
  };
  /**
   *
   */
  componentDidMount() {
    const { location } = this.props;
    const lSearch = location.search;
    const { filter } = qs.parse(lSearch);
    this.setState({
      selectedFilter: filter || ""
    });
    this.props.getOrders({ filter: filter });
    const ele = document.getElementById("simplebar-track");

    let workflow = document.getElementById("simplebar-content");
    let workflowTop;
    if (workflow && ele) {
      workflowTop = workflow.getBoundingClientRect().top;
      this.dragElement(ele, workflow);
    }
    window.addEventListener("scroll", e => this.handleScroll(e, workflowTop));
  }

  componentDidUpdate = ({ orderReducer }) => {
    const ele = document.getElementById("simplebar-track");
    let workflow = document.getElementById("simplebar-content");
    if (workflow && ele) {
      this.dragElement(ele, workflow);
    }
    if (workflow) {
      const workFlowWidth = workflow.clientWidth;
      let workflowGridCard = document
        .querySelector(".workflow-grid-card-warp")
        .getBoundingClientRect().width;
      const widthToCheck = workflowGridCard - workFlowWidth;
      const widthToApply = workFlowWidth - widthToCheck;
      if (orderReducer.orderData !== this.props.orderReducer.orderData) {
        if (workflowGridCard > workFlowWidth) {
          this.setState({
            trackWidth: widthToApply,
            scrollToWidth: widthToCheck
          });
        } else {
          this.setState({
            trackWidth: 0,
            scrollToWidth: 0
          });
        }
      }
      // function to hnadle scrollbar movment if header fixed onscroll
      this.scrollObserve();
    }
  };
  /**
   *
   */
  handleScroll = (e, top) => {
    const { scrollPos } = this.state
    var scrollY = window.scrollY;
    var ele = document.getElementsByClassName("workflow-grid-card");
    // let workflow = document.getElementById("simplebar-content");
    // let workflowTop;
    // if (workflow && ele) {
    //   workflowTop = workflow.getBoundingClientRect().top;
    // }

    for (let i = 0; i < ele.length; i++) {
      if (scrollY > top) {
        this.setState({
          scrollToFixed: true
        });
        ele[i].classList.add("fixed"); // WITH space added
        ele[i].childNodes[0].style.transform = `translateX(-${scrollPos}px)`;
      } else {
        ele[i].classList.remove("fixed"); // WITH space added
        if (ele[i].childNodes[0].style) {
          ele[i].childNodes[0].removeAttribute("style");
        }
        this.setState({
          scrollToFixed: false
        });
      }
    }
  };

  // Observer called in didupdate
  scrollObserve = () => {
    const { scrollToFixed } = this.state;
    const workflowGridEle = document.getElementsByClassName(
      "workflow-grid-card"
    );
    const trackEle = document.getElementById("simplebar-scroll-track");
    if (trackEle) {
      let observer = new MutationObserver(mutationRecords => {
        if (scrollToFixed) {
          let leftVal = mutationRecords[0].target.style.left;
          for (let i = 0; i < workflowGridEle.length; i++) {
            workflowGridEle[i].childNodes[0].style.transform = `translateX(-${leftVal})`;
          }
        } else {
          for (let i = 0; i < workflowGridEle.length; i++) {
            workflowGridEle[i].childNodes[0].style.transform = `none`;
          }
        }
      });
      observer.observe(trackEle, {
        attributes: true,
        attributeOldValue: true,
        characterData: true,
        characterDataOldValue: true,
        childList: true,
        subtree: true
      });
    }
  };

  /**
   *
   */
  // called on time of left side panel width changed
  handleResize = width => {
    let workflowGridCard;
    const trackEle = document.getElementById("simplebar-scroll-track");
    const workflowGridCardEle = document.querySelector(
      ".workflow-grid-card-warp"
    );

    const classVal = document.body.classList.contains("sidebar-minimized");
    if (workflowGridCardEle) {
      workflowGridCard = workflowGridCardEle.getBoundingClientRect().width;
    }
    const widthToCheck = workflowGridCard - width;
    const widthToApply = width - widthToCheck;
    if (trackEle) {
      if (classVal) {
        trackEle.style.width = width + "px";
        trackEle.style.left = 50 + "px";
      } else {
        trackEle.style.left = 200 + "px";
      }
      this.setState({
        trackWidth: widthToApply,
        scrollToWidth: widthToCheck
      });
    }
  };
  /**
   *
   */
  dragElement = (ele, workflow) => {
    if (ele) {
      ele.onmousedown = e => this.dragMouseDown(e, ele, workflow);
    }
  };

  dragMouseDown = (e, ele, workflow) => {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    document.onmouseup = e => this.closeDragElement(e, pos3);
    // call a  whenever the cursor moves:
    document.onmousemove = e => this.elementDrag(e, ele, workflow);
  };

  elementDrag = (e, ele, workflow) => {
    const { scrollToWidth, scrollToFixed } = this.state;
    var workflowGridEle = document.getElementsByClassName("workflow-grid-card");
    let finalPos = 0;
    e = e || window.event;
    e.preventDefault();
    pos1 = pos3 - e.clientX;
    pos3 = e.clientX;
    finalPos = ele.offsetLeft - pos1;
    if (finalPos < -1) {
      finalPos = 0;
    } else if (finalPos >= scrollToWidth) {
      finalPos = scrollToWidth;
    }
    if (finalPos <= scrollToWidth && finalPos > -1) {
      this.setState({
        scrollPos: finalPos
      });
      workflow.scrollLeft = finalPos;
      if (scrollToFixed) {
        for (let i = 0; i < workflowGridEle.length; i++) {
          workflowGridEle[i].childNodes[0].style.transform =
            "translateX(" + -finalPos + "px)";
        }
      }
    }
  };

  closeDragElement = () => {
    document.onmouseup = null;
    document.onmousemove = null;
  };

  handleScrollLeft = e => {
    const workFlowEle = document.getElementById("simplebar-content");
    this.setState({
      scrollPos: workFlowEle.scrollLeft
    });
  };
  /**
    
    * 
   */
  handleInputChange = e => {
    const { name, value } = e.target;
    this.setState(
      {
        [name]: value,
        errors: {
          ...this.state.errors,
          [name]: null
        }
      },
      () => this.props.getOrders({ filter: value })
    );
    if (value !== "") {
      this.props.redirectTo(
        `${AppRoutes.WORKFLOW.url}?${qs.stringify({ filter: value })}`
      );
    } else {
      this.props.redirectTo(`${AppRoutes.WORKFLOW.url}`);
    }
  };
  /**
   *
   */
  closeOptionModal = () =>
    this.setState({
      showMoveOptions: false,
      selectedOrderStatusToDelete: {},
      newStatus: null
    });
  /**
   *
   */
  renderOrderStatusMoveModal = () => {
    const {
      showMoveOptions,
      selectedOrderStatusToDelete,
      newStatus
    } = this.state;
    return {
      isOpen: showMoveOptions,
      headerText: "Choose Status to Move Current Orders",
      modalProps: {
        style: {
          width: 500
        }
      },
      toggle: this.closeOptionModal,
      footerButtons: [
        {
          text: "Close",
          onClick: this.closeOptionModal
        },
        {
          text: "Move and Delete it!",
          color: "primary",
          onClick: async () => {
            if (!newStatus) {
              if (!toast.isActive(toastId)) {
                toastId = toast.error("Please choose a status to move.");
              }
              // toast.error("Please choose a status to move.");
              return;
            }
            this.props.deleteOrderStatus({
              statusId: selectedOrderStatusToDelete.orderStatusId,
              newStatusId: newStatus
            });
            this.closeOptionModal();
          }
        }
      ]
    };
  };
  /**
   *
   */
  deleteOrderStatus = data => {
    const { orderReducer } = this.props;
    const { orderStatus } = orderReducer;
    let abc = data.orderStatusId;
    let check =
      orderReducer && orderReducer.orderData && orderReducer.orderData.orders
        ? orderReducer.orderData.orders
        : "";
    let result = check[abc] ? check[abc] : "";
    if (result && result.length > 0 && orderStatus && orderStatus.length && orderStatus.length > 1) {
      this.setState({
        showMoveOptions: true,
        selectedOrderStatusToDelete: data
      });
    } else {
      this.props.deleteOrderStatus({
        statusId: abc
      });
    }
  };

  toggleAddNewOptions = () => {
    this.setState({
      showAddNewOptions: !this.state.showAddNewOptions
    });
  };
  /**
   *
   */
  toggleAddNewOrderStatus = () => {
    const { modelInfoReducer } = this.props;
    const { modelDetails } = modelInfoReducer;
    const { addOrderStatusModalOpen } = modelDetails;
    this.props.modelOperate({
      addOrderStatusModalOpen: !addOrderStatusModalOpen
    });
    this.setState({
      orderStatusName: "",
      errors: {
        ...this.state.errors,
        orderStatusName: null
      }
    });
  };
  /**
   *
   */
  deleteOrder = async data => {
    const { value } = await ConfirmBox({
      text: "Are you sure, you want to abandoned this order?"
    });
    if (!value) {
      return;
    }
    this.props.deleteOrder(data);
  };
  /**
   *
   */
  renderAddNew = () => {
    return (
      <div className={"mode-flow"}>
        <Dropdown
          direction="down"
          isOpen={this.state.showAddNewOptions}
          toggle={this.toggleAddNewOptions}
        >
          <DropdownToggle nav>
            <button
              className={"nav-icon icon-plus btn btn-outline-dark bg-white"}
              id={"modify-order"}
            />
            <UncontrolledTooltip target={"modify-order"}>
              Select to modify order
            </UncontrolledTooltip>
          </DropdownToggle>
          <DropdownMenu right>
            <DropdownItem onClick={this.handleOrder}>New Quote</DropdownItem>
            <DropdownItem onClick={this.toggleAddNewOrderStatus}>
              New Order Status
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    );
  };
  /**
   *
   */
  renderOrderSelectionModal = () => {
    const { selectedOrderStatusToDelete } = this.state;
    const { orderReducer } = this.props;
    const { orderStatus } = orderReducer;
    return (
      <CRMModal {...this.renderOrderStatusMoveModal()}>
        {orderStatus &&
          orderStatus.length &&
          orderStatus.map((stat, index) => {
            return selectedOrderStatusToDelete.orderStatusId !== stat._id ? (
              <FormGroup check key={index}>
                <Label check>
                  <Input
                    type={"radio"}
                    id={`${index}-${Math.random()}`}
                    name={"selectedStatus"}
                    value={stat._id}
                    onClick={() => this.setState({ newStatus: stat._id })}
                  />
                  &nbsp;{stat.name}
                </Label>
              </FormGroup>
            ) : null;
          })}
      </CRMModal>
    );
  };
  /**
   *
   */
  addOrderStatus = e => {
    e.preventDefault();
    const { orderStatusName } = this.state;
    const { orderReducer } = this.props;
    const { orderStatus } = orderReducer;
    let { isValid, errors } = Validator(
      { orderStatusName },
      AddOrderStatusValidation,
      AddOrderStatusMessages
    );
    if (orderStatusName) {
      let data = orderStatus.filter(
        item => item.name === orderStatusName.toUpperCase()
      );
      let data1 = orderStatus.filter(item => item.name === orderStatusName);
      if (data.length || data1.length) {
        errors.orderStatusName = "This order status name already exist.";
        isValid = false;
      }
    }

    if (!isValid) {
      this.setState({
        errors
      });
      return;
    }
    this.props.addOrderStatus({ name: orderStatusName });
  };
  /**
   *
   */
  getAddOrderStatusOptions = () => {
    const { modelInfoReducer } = this.props;
    const { modelDetails } = modelInfoReducer;
    const { addOrderStatusModalOpen } = modelDetails;
    return {
      isOpen: addOrderStatusModalOpen,
      headerText: "Add New Order Status",
      toggle: this.toggleAddNewOrderStatus,
      modalProps: {
        style: {
          width: 500
        }
      },
      footerButtons: [
        {
          color: "primary",
          text: "Add",
          onClick: this.addOrderStatus,
          type: "submit"
        },
        {
          text: "Close",
          onClick: this.toggleAddNewOrderStatus,
          type: "button"
        }
      ]
    };
  };
  /**
   *
   */
  renderAddStatusModal = () => {
    const { orderStatusName, errors } = this.state;
    return (
      <CRMModal {...this.getAddOrderStatusOptions()}>
        <Row className="justify-content-center">
          <Col md="12">
            <FormGroup>
              <InputGroup>
                <Label
                  htmlFor="name"
                  className="customer-modal-text-style"
                  style={{ minWidth: "auto" }}
                >
                  Status <span className={"asteric"}>*</span>
                </Label>
                <div className={"input-block"}>
                  <Input
                    type={"text"}
                    placeholder={"Ex:-Invoice"}
                    onChange={this.handleInputChange}
                    value={orderStatusName}
                    name="orderStatusName"
                    invalid={errors.orderStatusName ? true : false}
                  />
                  <FormFeedback>
                    {errors.orderStatusName ? errors.orderStatusName : null}
                  </FormFeedback>
                </div>
              </InputGroup>
            </FormGroup>
          </Col>
        </Row>
      </CRMModal>
    );
  };
  /**
   *
   */
  orderStatus = (type, value, orderId) => {
    const { profileInfoReducer } = this.props;
    const comapnyId = profileInfoReducer.profileInfo._id;
    const { orderReducer } = this.props;
    let payload = {};
    if (type === "authorizStatus") {
      payload = {
        status: value,
        _id: orderReducer.orderItems._id,
        authorizerId: comapnyId,
        isChangedOrderStatus: true,
        isAuthStatus: true,
        isOrderDetails: true
      };
    } else {
      payload = {
        isInvoice: value,
        _id: orderId ? orderId : orderReducer.orderItems._id,
        authorizerId: comapnyId,
        isChangedOrderStatus: true,
        isInvoiceStatus: true,
        isAuthStatus: true,
        isOrderDetails: true
      };
    }
    this.props.updateOrderDetails(payload);
  };
  /**
   * 
   */
  updateOrderStatusName = (name, index, id) => {
    const { orderReducer } = this.props;
    const { orderStatus } = orderReducer;
    let data = [...orderStatus];
    data[index] = {
      ...data[index], name: name
    }
    this.props.updateOrderStatusNameReq({ data, name, index, id });
  }
  /**
   *
   */
  render() {
    const {
      orderReducer,
      updateOrderStatus,
      updateOrderOfOrderStatus,
      redirectTo,
      modelInfoReducer,
      getAppointments,
      addAppointment,
      appointmentReducer
    } = this.props;
    const { orderData, orderStatus } = orderReducer;
    const { listView, selectedFilter, trackWidth, scrollPos } = this.state;

    return (
      <>
        <Card className={"white-card position-relative pt-0 mb-0"}>
          <CardBody className={"custom-card-body pt-0 "}>
            <Row className={"mb-2 ml-0"}>
              <Col className={"title-left-section"}>
                <h4 className={"card-title"}>Workflow</h4>
                <div className={"workflow-mode"}>
                  <div className={"mode-inner"}>
                    <div className={"mode-flow"}>
                      <button
                        className={classNames("nav-icon", "icon-list", "btn", {
                          active: listView
                        })}
                        onClick={() => this.setState({ listView: true })}
                        id={"list-view"}
                      />
                      <UncontrolledTooltip target={"list-view"}>
                        Click to view List
                      </UncontrolledTooltip>
                    </div>
                    <div className="mode-flow">
                      <button
                        className={classNames("nav-icon", "icon-grid", "btn", {
                          active: !listView
                        })}
                        onClick={() => this.setState({ listView: false })}
                        id={"grid-view"}
                      />
                      <UncontrolledTooltip target={"grid-view"}>
                        Click to view Grid
                      </UncontrolledTooltip>
                    </div>
                  </div>
                  {this.renderAddNew()}
                </div>
              </Col>
              <Col className={"title-right-section"}>
                <div className={"invt-add-btn-block"}>
                  <Button
                    onClick={this.handleOrder}
                    color={"primary"}
                    id={"add-Appointment"}
                  >
                    <i className={"fa fa-plus mr-1"} /> New Quote
                  </Button>
                  <UncontrolledTooltip target={"add-Appointment"}>
                    Add a New Quote
                  </UncontrolledTooltip>
                </div>
                {orderData && orderData.totalOrders ? (
                  <div className="font-weight-bold font-bold pt-2 pr-3">
                    <b className="">Total Orders :</b>&nbsp;
                    <b>
                      {orderData && orderData.totalOrders
                        ? orderData.totalOrders
                        : 0}
                    </b>
                  </div>
                ) : null}
                <div className="workFlow-filter">
                  <i className="fas fa-filter" />

                  <Input
                    type={"select"}
                    name="selectedFilter"
                    className={"form-control"}
                    value={selectedFilter}
                    onChange={this.handleInputChange}
                  >
                    <option value={""}>All</option>
                    <option value={"authorized"}>Authorized</option>
                    <option value={"unauthorized"}>Unauthorized</option>
                    <option value={"paid"}>Paid</option>
                    <option value={"unpaid"}>Unpaid</option>
                    {/* <option value={"Archive"}>Archive</option> */}
                  </Input>
                </div>
              </Col>
            </Row>
            <Row className={"m-0"}>
              <Col sm={"12"} className={"p-0 position-relative"}>
                {listView ? (
                  <WorkflowListView
                    orderData={orderData}
                    orderStatus={orderStatus}
                    orderStatus1={this.orderStatus}
                    updateOrderStatus={updateOrderStatus}
                    updateOrderOfOrderStatus={updateOrderOfOrderStatus}
                    deleteOrderStatus={this.deleteOrderStatus}
                    deleteOrder={this.deleteOrder}
                    redirectTo={redirectTo}
                    modelInfoReducer={modelInfoReducer}
                    addAppointment={addAppointment}
                    getAppointments={getAppointments}
                    appointmentReducer={appointmentReducer}
                    updateOrderStatusName={this.updateOrderStatusName}
                  />
                ) : (
                    <div
                      style={{ overflowX: "auto" }}
                      className={"simplebar-content "}
                      id={"simplebar-content"}
                      onScroll={e => this.handleScrollLeft(e)}
                    >
                      <ResizeObserver
                        onResize={rect =>
                          this.handleResize(rect.width, rect.height)
                        }
                      />
                      <WorkflowGridView
                        orderData={orderData}
                        orderStatus={orderStatus}
                        orderStatus1={this.orderStatus}
                        updateOrderStatus={updateOrderStatus}
                        deleteOrderStatus={this.deleteOrderStatus}
                        updateOrderOfOrderStatus={updateOrderOfOrderStatus}
                        deleteOrder={this.deleteOrder}
                        redirectTo={redirectTo}
                        modelInfoReducer={modelInfoReducer}
                        addAppointment={addAppointment}
                        getAppointments={getAppointments}
                        appointmentReducer={appointmentReducer}
                        updateOrderStatusName={this.updateOrderStatusName}
                      />
                    </div>
                  )}
                {!listView ? (
                  <div
                    className={"simplebar-scroll-track"}
                    id={"simplebar-scroll-track"}
                  >
                    <div
                      className={"simplebar-track"}
                      id={"simplebar-track"}
                      style={{
                        width: `${trackWidth}px`,
                        left: `${scrollPos}px`,
                        position: "absolute"
                      }}
                    ></div>
                  </div>
                ) : null}
              </Col>
            </Row>
          </CardBody>
        </Card>
        {this.renderOrderSelectionModal()}
        {this.renderAddStatusModal()}
      </>
    );
  }
}
const mapStateToProps = state => ({
  orderReducer: state.orderReducer,
  modelInfoReducer: state.modelInfoReducer,
  appointmentReducer: state.appointmentReducer
});
const mapDispatchToProps = dispatch => ({
  addOrderRequest: data => dispatch(addOrderRequest(data)),
  getOrders: data => dispatch(getOrderList(data)),
  updateOrderStatus: data => dispatch(updateOrderStatus(data)),
  deleteOrderStatus: data => dispatch(deleteOrderStatusRequest(data)),
  addOrderStatus: data => dispatch(addOrderStatus(data)),
  updateOrderOfOrderStatus: data => dispatch(updateOrderOfOrderStatus(data)),
  deleteOrder: data => dispatch(deleteOrderRequest(data)),
  addAppointment: data => dispatch(addAppointmentRequest(data)),
  getAppointments: data => dispatch(getAppointments(data)),
  updateOrderDetails: data => {
    dispatch(updateOrderDetailsRequest(data));
  },
  updateOrderStatusNameReq: data => {
    dispatch(updateOrderStatusNameReq(data));
  }
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkFlow);
