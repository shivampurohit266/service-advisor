import { Card, CardBody, Input, UncontrolledTooltip } from "reactstrap";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import React, { Component, Suspense } from "react";
import { AppRoutes } from "../../config/AppRoutes";
import Loader from "../Loader/Loader";
import InvoiceTable from "./invoiceTable";
import {
  getOrderIdRequest,
  customerGetRequest,
  vehicleGetRequest,
  addNewInspection,
  addInspectionTemplate,
  addMessageTemplate,
  getMessageTemplate,
  getTemplateList,
  updateMessageTemplate,
  deleteMessageTemplate,
  searchMessageTemplateList,
  sendMessageTemplate,
  getInventoryPartsList,
  addPartToService,
  addTireToService,
  requestAddPart,
  addNewTier,
  getTiersList,
  labourAddRequest,
  addLaborToService,
  labourListRequest,
  getUsersList,
  addNewService,
  getLabelList,
  addNewLabel,
  getCannedServiceList,
  updateOrderDetailsRequest,
  getOrderDetailsRequest,
  deleteLabel,
  getMatrixList,
  getRateStandardListRequest,
  rateAddRequest,
  setRateStandardListStart,
  getInventoryPartVendors,
  addTimeLogRequest,
  updateTimeLogRequest,
  startTimer,
  stopTimer,
  switchTask,
  sendMessage,
  deleteNotes,
  addPaymentRequest,
  addNewCannedService,
  deleteCannedServiceRequest,
  getOrderList,
  updateOrderStatus,
  deleteService,
  genrateInvoice,
  customerAddRequest,
  vehicleAddRequest,
  getOrderListForSelect,
  addAppointmentRequest,
  getAppointments,
  newMsgSend,
  addInspcetionToReducer,
  submitServiceDataSuccess,
  updateOrderServiceData,
  getVehicleMakeModalReq,
  getVehicleModalReq
} from "../../actions";
import Services from "../../components/Orders/Services";
import Inspection from "../../components/Orders/Inspection";
import TimeClock from "../../components/Orders/TimeClock";
import Message from "../../components/Orders/Message";
import CustomerVehicle from "../../components/Orders/CutomerVehicle";
import OrderDetails from "../../components/Orders/OrderDetails";
import SendInspection from "../../components/Orders/Inspection/sentInspect";
import MessageTemplate from "../../components/Orders/Inspection/messageTemplate";
import { logger } from "../../helpers";
import qs from "query-string";
const OrderTab = React.lazy(() => import("../../components/Orders/OrderTab"));

export const OrderComponents = [
  {
    component: Services
  },
  {
    component: Inspection
  },
  {
    component: TimeClock
  },
  {
    component: Message
  }
];
const OrderTabs = [
  {
    name: AppRoutes.WORKFLOW_ORDER_SERVICES.name
  },
  {
    name: AppRoutes.WORKFLOW_ORDER_INSPECTION.name
  },
  {
    name: AppRoutes.WORKFLOW_ORDER_TIME_CLOCK.name
  },
  {
    name: AppRoutes.WORKFLOW_ORDER_MESSAGES.name
  }
];
class Order extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 0,
      orderId: "",
      customerData: "",
      vehicleData: "",
      isError: false,
      orderName: "",
      isPrint: false,
      isOrderSubbmited: false,
      serviceData: "",
      sentModal: false,
      mesageModal: false,
      pdfBlob: "",
      isOrderUpdate: true,
      isCustomerVehicleUpdate: false
    };
    this.orderNameRef = React.createRef();
  }
  componentDidMount() {
    this.props.getOrderId();
    this.props.getLabelList();
    this.props.getOrders();
    this.props.getCannedServiceList();
    const query = qs.parse(this.props.location.search);
    this.setState({
      orderId: this.props.match.params.id,
      activeTab: query.tab
        ? OrderTabs.findIndex(d => d.name === decodeURIComponent(query.tab))
        : 0
    });
    this.props.getOrderDetailsRequest({ _id: this.props.match.params.id });

    // setTimeout(() => {
    //   this.orderNameRef.current.focus();
    // }, 10);
    logger(this.props.location);
  }
  componentDidUpdate = ({
    serviceReducers,
    inspectionReducer,
    orderReducer,
    messageReducer,
    location
  }) => {
    /**
     *
     */
    if (this.props.location.search !== location.search) {
      const query = qs.parse(this.props.location.search);
      this.setState({
        activeTab: query.tab
          ? OrderTabs.findIndex(d => d.name === decodeURIComponent(query.tab))
          : 0
      });
    }
    // if (
    //   (serviceReducers.isLoading !== this.props.serviceReducers.isLoading ||
    //     inspectionReducer.inspectionData.isSuccess !==
    //       this.props.inspectionReducer.inspectionData.isSuccess) &&
    //   !this.props.serviceReducers.isAddServiceItem
    // ) {
    //   this.props.getOrderDetailsRequest({ _id: this.props.match.params.id });
    // }
    if (
      orderReducer.orderItems && (orderReducer.orderItems !== this.props.orderReducer.orderItems ||
        orderReducer.isOrderLoading !== this.props.orderReducer.isOrderLoading ||
        messageReducer.messageData.isSuccess !==
        this.props.messageReducer.messageData.isSuccess)
    ) {
      const {
        orderName,
        customerId,
        vehicleId
      } = this.props.orderReducer.orderItems;
      this.setState({
        orderName: orderName || "",
        customerData: customerId,
        vehicleData: vehicleId
      });
    }
  };
  /**
   *
   */
  onTabChange = activeTab => {
    this.props.redirectTo(
      `${AppRoutes.WORKFLOW_ORDER.url.replace(
        ":id",
        this.state.orderId
      )}?tab=${encodeURIComponent(OrderTabs[activeTab].name)}`
    );
  };

  addInventoryPart = data => {
    this.props.addInventoryPart({ data });
  };

  customerVehicleData = (customer, vehicle, isCustomerVehicleUpdate) => {
    if (customer && vehicle) {
      this.setState({
        customerData: customer,
        vehicleData: vehicle,
        isCustomerVehicleUpdate
      });
    } else if (customer && !vehicle) {
      this.setState({
        customerData: customer,
        vehicleData: "",
        isOrderUpdate: false,
        isCustomerVehicleUpdate
      });
    } else if (vehicle && !customer) {
      this.setState({
        customerData: "",
        vehicleData: vehicle,
        isOrderUpdate: false,
        isCustomerVehicleUpdate
      });
    } else {
      this.setState({
        customerData: "",
        vehicleData: "",
        isOrderUpdate: false,
        isCustomerVehicleUpdate
      });
    }
  };
  handleEditOrder = () => {
    const { customerData, vehicleData, orderId, orderName } = this.state;
    logger("!!!!!!!!!!!!", customerData, vehicleData, orderId, orderName);
    if (!customerData || !vehicleData) {
      this.setState({
        isError: true
      });
      return;
    }
    let customerValue, vehicleValue;
    if (customerData.data && vehicleData.data) {
      customerValue = customerData.data._id;
      vehicleValue = vehicleData.data._id;
    } else if (!customerData.data && vehicleData.data) {
      customerValue = customerData._id;
      vehicleValue = vehicleData.data._id;
    } else if (customerData.data && !vehicleData.data) {
      customerValue = customerData.data._id;
      vehicleValue = vehicleData._id;
    } else {
      customerValue = customerData._id;
      vehicleValue = vehicleData._id;
    }
    const payload = {
      customerId: customerValue ? customerValue : null,
      vehicleId: vehicleValue ? vehicleValue : null,
      orderName: orderName,
      isOrderDetails: true,
      _id: orderId
    };
    logger("*******payload*****", payload);
    this.setState({
      isOrderUpdate: true,
      isCustomerVehicleUpdate: false
    });
    this.props.updateOrderDetails(payload);
  };
  handleChange = e => {
    const { name, value } = e.target;
    this.setState({
      [name]: value
    });
  };
  onUpdate = (type, value) => {
    const { profileInfoReducer } = this.props;
    const comapnyId = profileInfoReducer.profileInfo._id;
    const { orderReducer } = this.props;
    let payload = {};
    payload = {
      poNumber: value,
      _id: orderReducer.orderItems._id,
      authorizerId: comapnyId,
      // isChangedOrderStatus: true,
      // isInvoiceStatus: true,
      // isAuthStatus: true,
      // isOrderDetails: true
    }
    this.props.updateOrderDetails(payload);
  }
  orderStatus = (type, value) => {
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
        _id: orderReducer.orderItems._id,
        authorizerId: comapnyId,
        isChangedOrderStatus: true,
        isInvoiceStatus: true,
        isAuthStatus: true,
        isOrderDetails: true
      };
    }
    this.props.updateOrderDetails(payload);
  };

  handelTemplateModal = () => {
    this.setState({
      sentModal: !this.state.sentModal
    });
  };

  toggleMessageTemplate = ele => {
    this.setState({
      mesageModal: !this.state.mesageModal
    });
  };

  getPdf = () => {
    const { orderReducer, pdfReducer } = this.props;
    let filename;
    if (pdfReducer.invoiceUrl !== "") {
      filename = pdfReducer.invoiceUrl;
    } else {
      filename =
        orderReducer && orderReducer.orderItems
          ? orderReducer.orderItems.invoiceURL
          : "";
    }
    console.log(filename, "filename");
    let pdfWindow = window.open("");
    pdfWindow.document.body.style.margin = "0px";
    pdfWindow.document.body.innerHTML =
      `<html><head><title>Order Invoice</title></head><body><embed width='100%' height='100%' name='plugin' data='pdf' type='application/pdf' src=${filename}></embed></body></html>`;

  };

  render() {
    const {
      activeTab,
      customerData,
      vehicleData,
      isError,
      orderName,
      orderId,
      isOrderUpdate,
      isCustomerVehicleUpdate
    } = this.state;
    const {
      getVehicleData,
      getCustomerData,
      modelInfoReducer,
      modelOperate,
      addNewInspection,
      addInspectionTemplate,
      addMessageTemplate,
      getMessageTemplate,
      getTemplateList,
      updateMessageTemplate,
      deleteMessageTemplate,
      searchMessageTemplateList,
      getPartDetails,
      addPartToService,
      addTireToService,
      serviceReducers,
      addLaborToService,
      addInventryTire,
      addLaborInventry,
      getTireDetails,
      getLaborDetails,
      getUserData,
      addNewService,
      labelReducer,
      getCannedServiceList,
      addNewLabel,
      deleteLabel,
      sendMessageTemplate,
      orderReducer,
      getPriceMatrix,
      getStdList,
      addRate,
      profileInfoReducer,
      rateStandardListReducer,
      getInventoryPartsVendors,
      addTimeLogRequest,
      timelogReducer,
      updateTimeLogRequest,
      startTimer,
      stopTimer,
      switchTimer,
      sendMessage,
      messageReducer,
      deleteNotes,
      activityReducer,
      addPaymentRequest,
      paymentReducer,
      addNewCannedService,
      deleteCannedServiceRequest,
      updateOrderStatus,
      updateOrderDetails,
      deleteService,
      genrateInvoice,
      customerAddRequest,
      customerFleetReducer,
      customerInfoReducer,
      vehicleAddRequest,
      vehicleAddInfoReducer,
      appointmentReducer,
      getOrdersData,
      addAppointment,
      getAppointments,
      newMsgSend,
      addInspcetionToReducer,
      pdfReducer,
      submitServiceDataSuccess,
      updateOrderServiceData,
      customerListReducer,
      getVehicleMakeModalReq,
      getVehicleModalReq,
      vehicleListReducer,
    } = this.props;
    // const { orderIDurl, customerIDurl, companyIDurl } = orderReducer
    return (
      <div className="animated fadeIn">
        {!orderReducer.isOrderLoading ? (
          <Card className="white-card" id={"white-card"}>
            <div className="workflow-section">
              <div className={"workflow-left"}>
                <CardBody className={"custom-card-body inventory-card"}>
                  <div
                    className={
                      "d-flex order-info-block flex-row justify-content-between pb-2"
                    }
                  >
                    <div className={"order-info-head d-flex"}>
                      <h3 className={"mr-3 orderId"}>
                        Order (
                        {`#${
                          typeof this.props.orderReducer.orderId !== "object"
                            ? this.props.orderReducer.orderId
                            : null
                          }`}
                        )
                      </h3>
                      <div className="input-block">
                        <Input
                          placeholder={"Enter a order title"}
                          onChange={e => this.handleChange(e)}
                          name={"orderName"}
                          value={orderName}
                          maxLength={"250"}
                          className={"order-name-input"}
                          ref={this.orderNameRef}
                          autoFocus
                        />
                      </div>
                    </div>
                  </div>

                  <div className={"order-top-section"}>
                    <CustomerVehicle
                      getCustomerData={getCustomerData}
                      getVehicleData={getVehicleData}
                      customerVehicleData={this.customerVehicleData}
                      isError={isError}
                      handleEditOrder={this.handleEditOrder}
                      orderReducer={orderReducer}
                      profileInfoReducer={profileInfoReducer}
                      addCustomer={customerAddRequest}
                      customerFleetReducer={customerFleetReducer}
                      modelOperate={modelOperate}
                      modelInfoReducer={modelInfoReducer}
                      customerInfoReducer={customerInfoReducer}
                      addVehicle={vehicleAddRequest}
                      vehicleAddInfoReducer={vehicleAddInfoReducer}
                      getCustomerDetailsRequest={getCustomerData}
                      customerListReducer={customerListReducer}
                      getVehicleMakeModalReq={getVehicleMakeModalReq}
                      getVehicleModalReq={getVehicleModalReq}
                      vehicleListReducer={vehicleListReducer}
                    />
                  </div>
                  <div className={"position-relative"}>
                    {this.props.orderReducer.orderItems &&
                      (!this.props.orderReducer.orderItems.customerId ||
                        !isOrderUpdate ||
                        isCustomerVehicleUpdate ||
                        !this.props.orderReducer.orderItems.vehicleId) ? (
                        <div className={"service-overlay"}>
                          <img
                            src="https://gramener.com/schoolminutes/img/arrow.png"
                            alt={"arrow"}
                          />
                          <h3>Please Add Order Details first</h3>
                        </div>
                      ) : null}

                    <div className={"order-activity"}>
                      {this.props.orderReducer.orderItems &&
                        this.props.orderReducer.orderItems.serviceId &&
                        this.props.orderReducer.orderItems.serviceId.length &&
                        this.props.orderReducer.orderItems.customerId &&
                        this.props.orderReducer.orderItems.vehicleId ? (
                          <>
                            <span
                              color=""
                              className="print-btn"
                              onClick={this.handelTemplateModal}
                              id={"sentInvoice"}
                            >
                              <i className="icons cui-cursor" />
                              &nbsp; Send
                          </span>
                            <UncontrolledTooltip target={"sentInvoice"}>
                              Click to Send Invoice
                          </UncontrolledTooltip>
                            <span
                              id="add-Appointment"
                              className={`print-btn ${
                                orderReducer.isPdfLoading ? "disabled" : ""
                                }`}
                              onClick={
                                orderReducer.isPdfLoading ? "" : this.getPdf
                              }
                            >
                              <i className="icon-printer icons " />
                              &nbsp;{" "}
                              {orderReducer.isPdfLoading ? "Printing.." : "Print"}
                            </span>
                            <UncontrolledTooltip target={"add-Appointment"}>
                              Click to Print Invoice
                          </UncontrolledTooltip>
                          </>
                        ) : null}
                    </div>
                    <div className={"position-relative"}>
                      <Suspense fallback={"Loading.."}>
                        <OrderTab
                          tabs={OrderTabs}
                          activeTab={activeTab}
                          onTabChange={this.onTabChange}
                        />
                      </Suspense>
                    </div>
                    <Suspense fallback={""}>
                      <React.Fragment>
                        {activeTab === 0 ? (
                          <Services
                            modelInfoReducer={modelInfoReducer}
                            modelOperate={modelOperate}
                            addPartToService={addPartToService}
                            addTireToService={addTireToService}
                            getPartDetails={getPartDetails}
                            addInventoryPart={this.addInventoryPart}
                            addInventryTire={addInventryTire}
                            serviceReducers={serviceReducers}
                            getTireDetails={getTireDetails}
                            addLaborInventry={addLaborInventry}
                            addLaborToService={addLaborToService}
                            getLaborDetails={getLaborDetails}
                            getUserData={getUserData}
                            addNewService={addNewService}
                            labelReducer={labelReducer}
                            addNewLabel={addNewLabel}
                            getCannedServiceList={getCannedServiceList}
                            customerData={customerData}
                            vehicleData={vehicleData}
                            orderId={orderId}
                            deleteLabel={deleteLabel}
                            getPriceMatrix={getPriceMatrix}
                            getStdList={getStdList}
                            addRate={addRate}
                            profileInfoReducer={profileInfoReducer}
                            rateStandardListReducer={rateStandardListReducer}
                            getInventoryPartsVendors={getInventoryPartsVendors}
                            orderReducer={orderReducer}
                            addNewCannedService={addNewCannedService}
                            deleteCannedServiceRequest={
                              deleteCannedServiceRequest
                            }
                            updateOrderDetails={updateOrderDetails}
                            deleteService={deleteService}
                            submitServiceDataSuccess={submitServiceDataSuccess}
                            updateOrderServiceData={updateOrderServiceData}
                            {...this.props}
                          />
                        ) : null}
                        {activeTab === 1 ? (
                          <Inspection
                            addNewInspection={addNewInspection}
                            inspectionData={this.props.inspectionReducer}
                            addInspectionTemplate={addInspectionTemplate}
                            getTemplateList={getTemplateList}
                            addMessageTemplate={addMessageTemplate}
                            getMessageTemplate={getMessageTemplate}
                            updateMessageTemplate={updateMessageTemplate}
                            deleteMessageTemplate={deleteMessageTemplate}
                            searchMessageTemplateList={
                              searchMessageTemplateList
                            }
                            customerData={customerData}
                            vehicleData={vehicleData}
                            sendMessageTemplate={sendMessageTemplate}
                            orderId={orderId}
                            profileReducer={profileInfoReducer}
                            updateOrderDetails={updateOrderDetails}
                            orderReducer={orderReducer}
                            genrateInvoiceSuccess={genrateInvoice}
                            addInspcetionToReducer={addInspcetionToReducer}
                            pdfReducer={pdfReducer}
                          />
                        ) : null}
                        {activeTab === 2 ? (
                          <TimeClock
                            modelInfoReducer={modelInfoReducer}
                            modelOperate={modelOperate}
                            orderId={orderId}
                            getUserData={getUserData}
                            orderItems={orderReducer.orderItems}
                            orderReducer={orderReducer}
                            addTimeLogRequest={addTimeLogRequest}
                            timelogReducer={timelogReducer}
                            editTimeLogRequest={updateTimeLogRequest}
                            startTimer={startTimer}
                            stopTimer={stopTimer}
                            switchTimer={switchTimer}
                          />
                        ) : null}
                        {activeTab === 3 ? (
                          <Message
                            searchMessageTemplateList={
                              searchMessageTemplateList
                            }
                            customerData={customerData}
                            vehicleData={vehicleData}
                            sendMessage={sendMessage}
                            profileReducer={profileInfoReducer}
                            orderId={orderId}
                            orderReducer={orderReducer}
                            messageReducer={messageReducer}
                            inspectionData={this.props.inspectionReducer}
                            addMessageTemplate={addMessageTemplate}
                            getMessageTemplate={getMessageTemplate}
                            updateMessageTemplate={updateMessageTemplate}
                            deleteMessageTemplate={deleteMessageTemplate}
                            deleteNotes={deleteNotes}
                            isSummary={false}
                            newMsgSend={newMsgSend}
                          />
                        ) : null}
                      </React.Fragment>
                    </Suspense>
                  </div>
                </CardBody>
              </div>
              <OrderDetails
                profileReducer={profileInfoReducer}
                orderReducer={orderReducer}
                onUpdate={this.onUpdate}
                orderStatus={this.orderStatus}
                activityReducer={activityReducer}
                modelInfoReducer={modelInfoReducer}
                modelOperate={modelOperate}
                addPaymentRequest={addPaymentRequest}
                paymentReducer={paymentReducer}
                updateOrderStatus={updateOrderStatus}
                getCustomerData={getCustomerData}
                getVehicleData={getVehicleData}
                getOrders={getOrdersData}
                addAppointment={addAppointment}
                getUserData={getUserData}
                getAppointments={getAppointments}
                appointmentReducer={appointmentReducer}
              />
              {this.props.orderReducer.orderItems &&
                this.props.orderReducer.orderItems.customerId &&
                this.props.orderReducer.orderItems.vehicleId ? (
                  <>
                    <SendInspection
                      isOpen={this.state.sentModal}
                      toggle={this.handelTemplateModal}
                      customerData={customerData}
                      vehicleData={vehicleData}
                      searchMessageTemplateList={
                        this.props.searchMessageTemplateList
                      }
                      pdfReducer={pdfReducer}
                      toggleMessageTemplate={this.toggleMessageTemplate}
                      sendMessageTemplate={this.props.sendMessageTemplate}
                      isOrder
                      orderReducer={orderReducer}
                      profileReducer={profileInfoReducer}
                    />
                    <MessageTemplate
                      isOpen={this.state.mesageModal}
                      toggle={this.toggleMessageTemplate}
                      inspectionData={this.props.inspectionReducer}
                      addMessageTemplate={this.props.addMessageTemplate}
                      getMessageTemplate={this.props.getMessageTemplate}
                      updateMessageTemplate={this.props.updateMessageTemplate}
                      deleteMessageTemplate={this.props.deleteMessageTemplate}
                    />
                    <div id="customers" className={"invoiceTableCompnent"}>
                      <InvoiceTable
                        orderReducer={orderReducer}
                        vehicleData={vehicleData}
                        profileReducer={profileInfoReducer}
                      />
                    </div>
                  </>
                ) : null}
            </div>
          </Card>
        ) : (
            <Loader />
          )}
      </div>
    );
  }
}
const mapStateToProps = state => ({
  orderReducer: state.orderReducer,
  inspectionReducer: state.inspectionReducer,
  modelInfoReducer: state.modelInfoReducer,
  serviceReducers: state.serviceReducers,
  labelReducer: state.labelReducer,
  profileInfoReducer: state.profileInfoReducer,
  rateStandardListReducer: state.rateStandardListReducer,
  timelogReducer: state.timelogReducer,
  messageReducer: state.messageReducer,
  activityReducer: state.activityReducer,
  paymentReducer: state.paymentReducer,
  pdfReducer: state.pdfReducer,
  customerFleetReducer: state.fleetReducer,
  customerInfoReducer: state.customerInfoReducer,
  vehicleAddInfoReducer: state.vehicleAddInfoReducer,
  appointmentReducer: state.appointmentReducer,
  customerListReducer: state.customerListReducer,
  vehicleListReducer: state.vehicleListReducer
});
const mapDispatchToProps = dispatch => ({
  getOrderId: () => {
    dispatch(getOrderIdRequest());
  },
  getCustomerData: data => {
    dispatch(customerGetRequest(data));
  },
  getVehicleData: data => {
    dispatch(vehicleGetRequest(data));
  },
  addNewInspection: data => {
    dispatch(addNewInspection(data));
  },
  addInspectionTemplate: data => {
    dispatch(addInspectionTemplate(data));
  },
  getTemplateList: data => {
    dispatch(getTemplateList(data));
  },
  addMessageTemplate: data => {
    dispatch(addMessageTemplate(data));
  },
  getMessageTemplate: data => {
    dispatch(getMessageTemplate(data));
  },
  updateMessageTemplate: data => {
    dispatch(updateMessageTemplate(data));
  },
  deleteMessageTemplate: data => {
    dispatch(deleteMessageTemplate(data));
  },
  searchMessageTemplateList: data => {
    dispatch(searchMessageTemplateList(data));
  },
  getPartDetails: data => {
    dispatch(getInventoryPartsList(data));
  },
  addPartToService: data => {
    dispatch(addPartToService(data));
  },
  addTireToService: data => {
    dispatch(addTireToService(data));
  },
  addInventoryPart: data => {
    dispatch(requestAddPart(data));
  },
  addInventryTire: data => {
    dispatch(addNewTier(data));
  },
  getTireDetails: data => {
    dispatch(getTiersList(data));
  },
  addLaborInventry: data => {
    dispatch(labourAddRequest(data));
  },
  addLaborToService: data => {
    dispatch(addLaborToService(data));
  },
  getLaborDetails: data => {
    dispatch(labourListRequest(data));
  },
  getUserData: data => {
    dispatch(getUsersList(data));
  },
  addNewService: data => {
    dispatch(addNewService(data));
  },
  getLabelList: () => {
    dispatch(getLabelList());
  },
  addNewLabel: data => {
    dispatch(addNewLabel(data));
  },
  getCannedServiceList: data => {
    dispatch(getCannedServiceList(data));
  },
  sendMessageTemplate: data => {
    dispatch(sendMessageTemplate(data));
  },
  updateOrderDetails: data => {
    dispatch(updateOrderDetailsRequest(data));
  },
  getOrderDetailsRequest: data => {
    dispatch(getOrderDetailsRequest(data));
  },
  deleteLabel: data => {
    dispatch(deleteLabel(data));
  },
  getPriceMatrix: data => {
    dispatch(getMatrixList(data));
  },
  getStdList: data => {
    dispatch(getRateStandardListRequest(data));
  },
  addRate: data => {
    dispatch(rateAddRequest(data));
  },
  setLabourRateDefault: data => {
    dispatch(setRateStandardListStart(data));
  },
  getInventoryPartsVendors: data => {
    dispatch(getInventoryPartVendors(data));
  },
  addTimeLogRequest: data => {
    dispatch(addTimeLogRequest(data));
  },
  updateTimeLogRequest: data => {
    dispatch(updateTimeLogRequest(data));
  },
  startTimer: data => dispatch(startTimer(data)),
  stopTimer: data => dispatch(stopTimer(data)),
  switchTimer: data => dispatch(switchTask(data)),
  sendMessage: data => {
    dispatch(sendMessage(data));
  },
  deleteNotes: data => {
    dispatch(deleteNotes(data));
  },
  addPaymentRequest: data => {
    dispatch(addPaymentRequest(data));
  },
  addNewCannedService: data => {
    dispatch(addNewCannedService(data));
  },
  getOrders: () => dispatch(getOrderList()),
  updateOrderStatus: data => dispatch(updateOrderStatus(data)),
  deleteCannedServiceRequest: data => {
    dispatch(deleteCannedServiceRequest(data));
  },
  deleteService: data => dispatch(deleteService(data)),
  genrateInvoice: data => {
    dispatch(genrateInvoice(data));
  },
  customerAddRequest: data => {
    dispatch(customerAddRequest(data));
  },
  vehicleAddRequest: data => {
    dispatch(vehicleAddRequest(data));
  },
  getOrdersData: data => dispatch(getOrderListForSelect(data)),
  addAppointment: data => dispatch(addAppointmentRequest(data)),
  getAppointments: data => dispatch(getAppointments(data)),
  newMsgSend: data => dispatch(newMsgSend(data)),
  addInspcetionToReducer: data => dispatch(addInspcetionToReducer(data)),
  submitServiceDataSuccess: data => dispatch(submitServiceDataSuccess(data)),
  updateOrderServiceData: data => dispatch(updateOrderServiceData(data)),
  getVehicleMakeModalReq: data => {
    dispatch(getVehicleMakeModalReq(data));
  },
  getVehicleModalReq: data => {
    dispatch(getVehicleModalReq(data));
  }
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Order));
