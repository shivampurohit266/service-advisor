import TimeInput from "react-time-input";
import MaskedInput from "react-text-mask";
import {
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  FormFeedback,
  Input
} from "reactstrap";
import Async from "react-select/lib/Async";
import classnames from "classnames";
import DayPicker from "react-day-picker";
import React, { Component } from "react";

import { logger } from "../../helpers";
import CRMModal from "../common/Modal";
import moment from "moment";
import { AppointmentColors, DefaultErrorMessage } from "../../config/Constants";
import Validator from "js-object-validation";
import {
  AddAppointmentValidations,
  AddAppointmentMessages
} from "../../validations";
import { toast } from "react-toastify";
import { SendEmailAndSMS } from "../SendReminderEmail&SMS";
import { CrmCustomerModal } from "../../components/common/CrmCustomerModal";
import { CrmVehicleModal } from "../../components/common/Vehicles/CrmVehicleModal";

export default class AddAppointment extends Component {
  isCustomerReqSent;
  isVehicleReqSent;
  isOrderReqSent;
  isTechnicianReqSent;
  constructor(props) {
    super(props);
    this.state = {
      customerId: "",
      appointmentDate: this.props.date || new Date(),
      errors: {},
      selectedCustomer: null,
      selectedVehicle: null,
      isEmail: false,
      isSms: false,
      startTime: moment.utc()
        .add(1, "hour")
        .format("HH:00"),
      endTime: moment.utc()
        .add(2, "hours")
        .format("HH:00"),
      appointmentTitle: "",
      note: "",
      selectedColor: AppointmentColors[0].value,
      selectedOrder: null,
      email: "",
      phone: "",
      selectedTechincians: [],
      isNewOrder: false
    };
    this.isCustomerReqSent = false;
    this.isVehicleReqSent = false;
    this.isOrderReqSent = false;
    this.isTechnicianReqSent = false;
  }
  /**
   *
   */
  componentDidUpdate({
    date: prevDate,
    editData: oldEditData,
    isOpen: oldIsOpen,
    customerInfoReducer,
    vehicleAddInfoReducer,
    orderReducer
  }) {
    const { isOpen, date, editData, orderData } = this.props;
    if (date !== prevDate) {
      this.setState({
        appointmentDate: date
      });
    }
    if (isOpen !== oldIsOpen) {
      this.resetState();
    }
    if (isOpen !== oldIsOpen && orderData) {
      if (orderData) {
        const customerId = orderData && orderData.customerId
          ? orderData.customerId
          : null;
        const vehicleId = orderData && orderData.vehicleId
          ? orderData.vehicleId
          : null;
        const orderId = orderData ? orderData : null
        this.setState({
          selectedCustomer: {
            data: customerId,
            label: `${customerId.firstName} ${customerId.lastName}`,
            value: customerId._id
          },
          selectedVehicle: vehicleId
            ? {
              data: vehicleId,
              label: `${vehicleId.make}`,
              value: vehicleId._id
            }
            : null,
          selectedOrder: orderId
            ? {
              data: orderId,
              label: `#${orderId.orderId ? orderId.orderId : ""} - ${orderId.orderName ? orderId.orderName : "Unnamed Order"}`,
              value: orderId._id
            }
            : null,
          email: customerId.email ? customerId.email : "",
          isEmail: customerId.email ? true : false,
          isSms: customerId.phoneDetail && customerId.phoneDetail.length ? true : false,
          phone: customerId.phoneDetail && customerId.phoneDetail.length ? customerId.phoneDetail[0].value : null
        })

      }
    }
    /**
     *
     */
    if (this.props.customerInfoReducer && this.props.vehicleAddInfoReducer) {
      if (customerInfoReducer.customerAddInfo !== this.props.customerInfoReducer.customerAddInfo) {
        const customerId = this.props.customerInfoReducer.customerAddInfo
        this.setState({
          selectedCustomer: {
            data: customerId,
            label: customerId ? `${customerId.firstName} ${customerId.lastName}` : "Type to select customer",
            value: customerId ? customerId._id : ""
          },
        });
      }
      if (vehicleAddInfoReducer.vehicleAddInfo !== this.props.vehicleAddInfoReducer.vehicleAddInfo) {
        const vehicleId = this.props.vehicleAddInfoReducer.vehicleAddInfo
        this.setState({
          selectedVehicle: vehicleId
            ? {
              data: vehicleId,
              label: `${vehicleId.make}`,
              value: vehicleId._id
            }
            : null,
        });
      }
    }
    /**
     *
     */
    if (editData && editData._id && oldEditData) {
      if (oldEditData._id !== editData._id) {
        const {
          email,
          phone,
          appointmentColor,
          appointmentDate,
          appointmentTitle,
          note,
          endTime,
          startTime,
          customerId,
          vehicleId,
          orderId,
          techinicians
        } = editData;
        this.setState({
          appointmentTitle,
          note,
          email,
          phone: phone ? phone : null,
          selectedColor: appointmentColor,
          appointmentDate: new Date(appointmentDate),
          endTime: moment.utc(endTime).format("HH:mm"),
          startTime: moment.utc(startTime).format("HH:mm"),
          selectedCustomer: {
            data: customerId,
            label: `${customerId.firstName} ${customerId.lastName}`,
            value: customerId._id
          },
          selectedVehicle: vehicleId
            ? {
              data: vehicleId,
              label: `${vehicleId.make}`,
              value: vehicleId._id
            }
            : null,
          selectedOrder: orderId
            ? {
              data: orderId,
              label: `#${orderId.orderId ? orderId.orderId : ""} - ${orderId.orderName ? orderId.orderName : "Unnamed order"}`,
              value: orderId._id
            }
            : null,
          selectedTechincians: techinicians.map(tech => {
            return {
              data: tech,
              label: `${tech.firstName} ${tech.lastName}`,
              value: tech._id
            };
          }),
          isEmail: customerId.email ? true : false,
          isSms: phone ? true : false,
        });
      }
    }
    if (this.state.isNewOrder && this.props.orderReducer && this.props.orderReducer.orderItems && orderReducer && orderReducer.orderItems && this.props.orderReducer.orderItems !== orderReducer.orderItems) {
      const { orderReducer } = this.props;
      const { orderItems } = orderReducer;
      let selectedOrder = {
        label: `#${orderItems.orderId ? orderItems.orderId : ""} - ${orderItems.orderName ? orderItems.orderName : "Unnamed order"}`,
        value: orderItems._id ? orderItems._id : null,
        data: orderItems ? orderItems : {}
      }
      this.setState({
        selectedOrder
      })
    }
  }
  /**
   *
   */
  handleInputChange = e => {

    if (e.target.name === "email" && e.target.value) {
      this.setState({
        isEmail: true
      })
    } else if (e.target.name === "email" && !e.target.value) {
      this.setState({
        isEmail: false
      })
    }
    if (e.target.name === "phone" && e.target.value) {

      if (isNaN(e.target.value)) {
        return
      }

      this.setState({
        isSms: true
      })
    }
    else if (e.target.name === "phone" && !e.target.value) {
      this.setState({
        isSms: false
      })
    }
    this.setState({
      [e.target.name]: e.target.value,
      errors: {
        ...this.state.errors,
        [e.target.name]: null
      }
    });
  };
  /**
   * 
   */
  handlePhoneValueChange = (event) => {
    const { value } = event.target;

    let phoneTrimed = (value.replace(/[- )(_]/g, ""))

    this.setState({
      phone: value,
      errors: {
        ...this.state.errors,
        phone: null
      }
    });
    if (value !== "" && phoneTrimed.length >= 10) {
      this.setState({
        isSms: true
      })
    } else {
      this.setState({
        isSms: false
      })
    }
    if (event.key && event.key === "Backspace") {
      this.setState({
        isSms: false,
      })
    }
  };
  /**
   *
   */
  onDayChange = appointmentDate => {
    this.setState({
      appointmentDate,
      errors: {
        ...this.state.errors,
        appointmentDate: null
      }
    });
  };
  /**
   *
   */
  loadCustomers = (input, callback) => {
    this.isCustomerReqSent = input !== "";
    this.props.getCustomerData({ input, callback });
  };
  /**
   *
   */
  loadVehicles = (input, callback) => {
    this.isVehicleReqSent = input !== "";
    const { selectedCustomer } = this.state;
    if (!selectedCustomer) {
      return callback([]);
    }

    this.props.getVehicleData({
      input,
      callback,
      customerId: selectedCustomer.value
    });
  };
  /**
   *
   */
  loadOrders = (input, callback) => {
    this.isOrderReqSent = input !== "";
    const { selectedCustomer } = this.state;
    if (!selectedCustomer) {
      return callback([]);
    }

    this.props.getOrders({
      input,
      callback,
      customerId: selectedCustomer.value
    });
  };
  /**
   *
   */
  loadTechnician = (input, callback) => {
    const type = "5ca3473d70537232f13ff1fa";
    this.props.getUserData({ input, type, callback });
  };
  /**
   *
   */
  onTimeChange = (time, type) => {
    this.setState({
      [type]: time,
      errors: {
        ...this.state.errors,
        [type]: null
      }
    });
  };
  /**
   *
   */
  resetState = () => {
    this.setState({
      customerId: "",
      appointmentDate: this.props.date || new Date(),
      errors: {},
      selectedCustomer: null,
      selectedVehicle: null,
      startTime: moment.utc()
        .add(1, "hour")
        .format("HH:mm"),
      endTime: moment.utc()
        .add(2, "hours")
        .format("HH:mm"),
      appointmentTitle: "",
      note: "",
      selectedColor: AppointmentColors[0].value,
      selectedOrder: null,
      email: "",
      phone: "",
      selectedTechincians: [],
      isEmail: false,
      isSms: false,
      isNewOrder: false
    });
  };
  /**
   *
   */
  addAppointment = e => {
    e.preventDefault();
    this.setState({
      errors: {}
    });
    try {
      const {
        selectedColor,
        note,
        email,
        phone,
        selectedCustomer,
        selectedOrder,
        selectedVehicle,
        appointmentDate,
        appointmentTitle,
        startTime,
        endTime,
        selectedTechincians,
        isEmail,
        isSms
      } = this.state;
      const { editData } = this.props;
      const techinicians = selectedTechincians.map(tech => {
        return tech.value;
      });
      const data = {
        selectedColor,
        note,
        email,
        phone,
        selectedCustomer:
          selectedCustomer && selectedCustomer.value
            ? selectedCustomer.value.toString()
            : "",
        selectedOrder:
          selectedOrder && selectedOrder.value
            ? selectedOrder.value.toString()
            : "",
        selectedVehicle:
          selectedVehicle && selectedVehicle.value
            ? selectedVehicle.value.toString()
            : "",
        appointmentDate: appointmentDate.toISOString(),
        appointmentTitle,
        startTime,
        endTime,
        techinicians,
        isEmail,
        isSms
      };

      let { errors, isValid } = Validator(
        data,
        AddAppointmentValidations,
        AddAppointmentMessages
      );
      if (phone && phone.length < 14) {
        isValid = false;
        errors.phone = "Phone number should be valid."
      }
      if (!isValid) {
        this.setState({
          errors
        });
        return;
      }
      if (editData && editData._id) {
        this.props.updateAppointment({ id: editData._id, data });
      } else {
        this.props.addAppointment(data);
      }
    } catch (error) {
      logger(error);
      toast.error(error.message || DefaultErrorMessage);
    }
  };
  /**
   *
   */
  handleCustomerModel = () => {
    const { modelDetails } = this.props.modelInfoReducer;
    let data = {
      customerModel: !modelDetails.customerModel,
      customerEditModel: false
    };
    this.props.modelOperate(data);
  }
  /**
   *
   */
  handleVehicleModel = () => {
    const { modelDetails } = this.props.modelInfoReducer;
    let data = {
      vehicleModel: !modelDetails.vehicleModel,
      vehicleEditModel: false
    };
    this.props.modelOperate(data);
  }
  /**
  *
  */
  handleVehicleCreate = (data) => {
    const payload = {
      ...data,
      workFlowVehicle: true
    }
    this.props.addVehicle(payload)
  }
  /**
    *
    */
  handleCustomerCreate = (data) => {
    const payload = {
      ...data,
      workFlowCustomer: true
    }
    this.props.addCustomer(payload)
  }
  /**
   *
   */
  handleReminder = (e) => {
    const { name, checked } = e.target
    this.setState({
      [name]: checked
    })
  }
  /**
   * 
   */
  handleCreateOrder = () => {
    const { selectedCustomer, selectedVehicle } = this.state
    this.props.addOrderRequest({
      customerId: selectedCustomer && selectedCustomer.value && selectedCustomer.value !== "" ? selectedCustomer.value : null,
      vehicleId: selectedVehicle && selectedVehicle.value && selectedVehicle.value !== "" ? selectedVehicle.value : null,
      isAppointment: true
    });
    this.setState({
      isNewOrder: true
    })
  }
  /**
   * 
   */
  render() {
    const {
      selectedCustomer,
      appointmentDate,
      errors,
      selectedVehicle,
      startTime,
      endTime,
      appointmentTitle,
      note,
      selectedColor,
      selectedOrder,
      email,
      phone,
      selectedTechincians,
      isEmail,
      isSms
    } = this.state;

    const { toggleAddAppointModal, isOpen, editData } = this.props;

    const modelDetails = this.props.modelInfoReducer ? this.props.modelInfoReducer.modelDetails : null
    const customerFleetReducer = this.props.customerFleetReducer ? this.props.customerFleetReducer : null
    const isEditMode = editData && editData._id ? true : false;
    const headerText = isEditMode
      ? "Update Appointment Details"
      : "Add Appointment Details";
    const buttons = [
      {
        text: isEditMode ? "Update Appointment" : "Add Appointment",
        color: "primary",
        type: "submit",
        onClick: this.addAppointment
      },
      {
        text: "Cancel",
        onClick: e => {
          this.resetState();
          toggleAddAppointModal(e);
        },
        type: "button"
      }
    ];

    return (
      <>
        <CRMModal
          isOpen={isOpen}
          toggle={e => {
            this.resetState();
            toggleAddAppointModal(e);
          }}
          headerText={headerText}
          footerButtons={buttons}
        >
          <Form
            onSubmit={this.addAppointment}
            className={classnames("add-appointment-form")}
          >
            <Row>
              <Col sm={"12"} className={"appointment-color-container"}>
                <Label className={"float-left"}>Appointment Label</Label>
                <div>
                  {AppointmentColors.map((color, index) => {
                    return (
                      <div
                        key={index}
                        style={{
                          backgroundColor: color.value
                        }}
                        className={classnames("appointment-colors", {
                          selected: selectedColor === color.value
                        })}
                        onClick={() =>
                          this.setState({
                            selectedColor: color.value
                          })
                        }
                      >
                        {selectedColor === color.value ? (
                          <i className={"fa fa-check text-white"} />
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </Col>
              <Col sm={"8"}>
                <Row>
                  <Col sm={"6"}>
                    <DayPicker
                      selectedDays={appointmentDate}
                      month={
                        new Date(
                          moment(appointmentDate).format("YYYY"),
                          moment(appointmentDate).format("MM") - 1
                        )
                      }
                      onDayClick={this.onDayChange}
                      disabledDays={{
                        before: new Date()
                      }}
                    />
                  </Col>
                  <Col sm={"6"} className={"pt-4"}>
                    <FormGroup>
                      <Label
                        htmlFor="name"
                        className="customer-modal-text-style"
                      >
                        Title <span className={"asteric"}>*</span>
                      </Label>
                      <div className={"input-block"}>
                        <Input
                          type="text"
                          placeholder="Meeting with John"
                          name="appointmentTitle"
                          onChange={this.handleInputChange}
                          value={appointmentTitle}
                          maxLength="30"
                          invalid={errors.appointmentTitle ? true : false}
                        />
                        {errors.appointmentTitle ? (
                          <FormFeedback>
                            {errors.appointmentTitle}
                          </FormFeedback>
                        ) : null}
                      </div>
                    </FormGroup>
                    <FormGroup>
                      <Label
                        htmlFor="name"
                        className="customer-modal-text-style"
                      >
                        Start Time <span className="asteric">*</span>
                      </Label>
                      <div className={"input-block"}>
                        <TimeInput
                          initTime={startTime}
                          ref="TimeInputWrapper"
                          className={classnames("form-control", {
                            "is-invalid": errors.startTime
                          })}
                          placeholder={"__:__"}
                          name={"startTime"}
                          onTimeChange={e =>
                            this.onTimeChange(e, "startTime")
                          }
                        />
                        {errors.startTime ? (
                          <FormFeedback>Start time is required</FormFeedback>
                        ) : null}
                      </div>
                    </FormGroup>
                    <FormGroup>
                      <Label
                        htmlFor="name"
                        className="customer-modal-text-style"
                      >
                        End Time <span className="asteric">*</span>
                      </Label>
                      <div className={"input-block"}>
                        <TimeInput
                          initTime={endTime}
                          ref="TimeInputWrapper"
                          className={classnames("form-control", {
                            "is-invalid": errors.endTime
                          })}
                          name={"endTime"}
                          onTimeChange={e => this.onTimeChange(e, "endTime")}
                          disabled={!startTime}
                          placeholder={"__:__"}
                        />
                        {errors.endTime ? (
                          <FormFeedback>End time is required</FormFeedback>
                        ) : null}
                      </div>
                    </FormGroup>
                    <FormGroup>
                      <Label
                        htmlFor="name"
                        className="customer-modal-text-style"
                      >
                        Notes
                    </Label>
                      <div className={"input-block"}>
                        <Input
                          type="textarea"
                          className={classnames("form-control", {
                            "is-invalid": errors.note
                          })}
                          name={"note"}
                          value={note}
                          onChange={this.handleInputChange}
                          placeholder={"Note"}
                          maxLength={"1000"}
                        />
                        {errors.note ? (
                          <FormFeedback>{errors.note}</FormFeedback>
                        ) : null}
                      </div>
                    </FormGroup>
                  </Col>
                  <Col sm={"12"} className={"pt-3"}>
                    <FormGroup className={"fleet-block"}>
                      <Label
                        htmlFor="name"
                        className="customer-modal-text-style"
                      >
                        Customer <span className="asteric">*</span>
                      </Label>
                      <div className={"input-block"}>
                        <Async
                          placeholder={"Type customer name"}
                          loadOptions={this.loadCustomers}
                          className={classnames("w-100 form-select", {
                            "is-invalid": errors.selectedCustomer
                          })}
                          value={selectedCustomer}
                          onChange={e => {
                            if (!e) {
                              e = {
                                data: {}
                              };
                              this.setState({
                                selectedCustomer: null
                              })
                            }
                            if (e && e.label === "+ Add New Customer") {
                              this.handleCustomerModel()
                            } else {
                              const customer = e.data;
                              const { phoneDetail } = customer;
                              let phone = "";
                              if (phoneDetail && phoneDetail.length) {
                                const tempPhone = phoneDetail.filter(
                                  d => d.phone === "mobile"
                                );
                                if (tempPhone.length) {
                                  phone = tempPhone[0].value;
                                }
                              }

                              this.setState({
                                selectedCustomer: e,
                                email: customer.email || "",
                                isEmail: customer.email ? true : false,
                                isSms: phone ? true : false,
                                phone,
                                errors: {
                                  ...this.state.errors,
                                  selectedCustomer: null,
                                  email: null,
                                  phone: null
                                }
                              });
                            }
                          }}
                          isClearable={true}
                          noOptionsMessage={() =>
                            this.isCustomerReqSent
                              ? "No customer found"
                              : "Type customer name"
                          }
                        // menuIsOpen={true}
                        />
                        {errors.selectedCustomer ? (
                          <FormFeedback>
                            {errors.selectedCustomer}
                          </FormFeedback>
                        ) : null}
                      </div>
                    </FormGroup>
                  </Col>
                  <Col md={"12"}>
                    <FormGroup className={"fleet-block"}>
                      <Label
                        htmlFor="name"
                        className="customer-modal-text-style"
                      >
                        Vehicle
                    </Label>
                      <div className={"input-block"}>
                        <Async
                          placeholder={"Type vehicle name"}
                          loadOptions={this.loadVehicles}
                          className={classnames("w-100 form-select", {
                            "is-invalid": errors.selectedVehicle
                          })}
                          value={selectedVehicle}
                          isClearable={true}
                          noOptionsMessage={() =>
                            this.isVehicleReqSent
                              ? "No vehicle found"
                              : "Type vehicle name"
                          }
                          onChange={e => {
                            if (e && e.label === "+ Add New Vehicle") {
                              this.handleVehicleModel()
                            } else {
                              this.setState({
                                selectedVehicle: e,
                                errors: {
                                  ...this.state.errors,
                                  selectedVehicle: null
                                }
                              });
                            }
                          }}
                          isDisabled={!selectedCustomer}
                        />
                        {errors.selectedVehicle ? (
                          <FormFeedback>
                            {errors.selectedVehicle}
                          </FormFeedback>
                        ) : null}
                      </div>
                    </FormGroup>
                  </Col>
                  <Col md={"6"}>
                    <FormGroup className={"phone-field"}>
                      <Label
                        htmlFor="name"
                        className="customer-modal-text-style"
                      >
                        Phone Number
                    </Label>
                      <div className={"input-block"}>
                        {/* <Input
                          type="text"
                          className={classnames("form-control", {
                            "is-invalid": errors.phone
                          })}
                          name={"phone"}
                          value={phone}
                          placeholder={"Phone"}
                          onChange={this.handleInputChange}
                        /> */}
                        <MaskedInput
                          mask={['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                          name="phone"
                          className={classnames("form-control", {
                            "is-invalid": errors.phone
                          })}
                          placeholder="(555) 055-0555"
                          maxLength="20"
                          value={phone}
                          guide={false}
                          onKeyDown={(e) => this.handlePhoneValueChange(e)}
                          onChange={(e) =>
                            this.handlePhoneValueChange(e)
                          }
                        />
                        {errors.phone ? (
                          console.log(),
                          <FormFeedback>{errors.phone}</FormFeedback>
                        ) : null}
                      </div>
                    </FormGroup>
                  </Col>
                  <Col md={"6"}>
                    <FormGroup>
                      <Label
                        htmlFor="name"
                        className="customer-modal-text-style"
                      >
                        Email
                    </Label>
                      <div className={"input-block"}>
                        <Input
                          type="text"
                          name={"email"}
                          value={email}
                          placeholder={"Email"}
                          onChange={this.handleInputChange}
                          invalid={errors.email ? true : false}
                        />
                        {errors.email ? (
                          <FormFeedback>{errors.email}</FormFeedback>
                        ) : null}
                      </div>
                    </FormGroup>
                  </Col>
                  <Col md={"12"}>
                    <FormGroup className={"fleet-block"}>
                      <Label
                        htmlFor="name"
                        className="customer-modal-text-style"
                      >
                        Select Order
                    </Label>
                      <div className={"input-block"}>
                        <Async
                          placeholder={"Type order name or number"}
                          loadOptions={this.loadOrders}
                          className={classnames("w-100 form-select", {
                            "is-invalid": errors.selectedOrder
                          })}
                          value={selectedOrder}
                          isClearable={true}
                          noOptionsMessage={() =>
                            this.isOrderReqSent
                              ? "No order found"
                              : "Type order name or number"
                          }
                          onChange={e => {
                            if (e && e.label === "+ Add New Order") {
                              this.handleCreateOrder()
                            }
                            this.setState({
                              selectedOrder: e
                            });
                          }}
                          isDisabled={!selectedCustomer}
                        />
                        {errors.selectedOrder ? (
                          <FormFeedback>{errors.selectedOrder}</FormFeedback>
                        ) : null}
                      </div>
                    </FormGroup>
                  </Col>
                  <Col md={"12"}>
                    <FormGroup className={"fleet-block"}>
                      <Label
                        htmlFor="name"
                        className="customer-modal-text-style"
                      >
                        Technician
                    </Label>
                      <div className={"input-block"}>
                        <Async
                          placeholder={"Type name of technician"}
                          isMulti
                          loadOptions={this.loadTechnician}
                          className={classnames("w-100 form-select", {
                            "is-invalid": errors.selectedTechincians
                          })}
                          isDisabled={this.props.isTechnician}
                          value={selectedTechincians}
                          isClearable={true}
                          noOptionsMessage={() =>
                            this.isTechnicianReqSent ||
                              selectedTechincians.length
                              ? "No techinician found"
                              : "Type name of technician"
                          }
                          onChange={e => {
                            logger(e);
                            this.setState({
                              selectedTechincians: e
                            });
                          }}
                        />
                        {errors.selectedTechincians ? (
                          <FormFeedback>
                            {errors.selectedTechincians}
                          </FormFeedback>
                        ) : null}
                      </div>
                    </FormGroup>
                  </Col>
                </Row>
              </Col>
              <Col sm={"4"}>
                <SendEmailAndSMS
                  headingTitle={"Send Reminder"}
                  handleReminder={this.handleReminder}
                  isEmail={isEmail}
                  isSms={isSms}
                  email={email}
                  phone={phone}
                />
              </Col>
            </Row>
          </Form>
          <CrmCustomerModal
            customerModalOpen={modelDetails ? modelDetails.customerModel : false}
            handleCustomerModalFun={this.handleCustomerModel}
            addCustomerFun={this.handleCustomerCreate}
            profileInfo={this.props.profileInfoReducer}
            editMode={false}
            customer={""}
            getCustomerFleetList={customerFleetReducer ? customerFleetReducer.customerFleetData : null}
          />
          <CrmVehicleModal
            vehicleModalOpen={modelDetails ? modelDetails.vehicleModel : false}
            handleVehicleModal={this.handleVehicleModel}
            submitCreateVehicleFun={this.handleVehicleCreate}
          />
        </CRMModal>
      </>
    );
  }
}
