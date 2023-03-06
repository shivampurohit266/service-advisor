import React, { Component } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Input,
  Row,
  Col,
  FormGroup,
  FormFeedback,
  Label,
  UncontrolledTooltip
} from "reactstrap";
import moment from "moment";
import { Async } from "react-select";
import Select from "react-select";
import Validator from "js-object-validation";
import {
  inspectValidations,
  inspectValidationMessage
} from "../../../validations/inspection";
import MaskedInput from "react-text-mask";

import { SendEmailAndSMS } from "../../SendReminderEmail&SMS/index";
import { ConfirmBox } from "../../../helpers/SweetAlert";

class SendInspection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recipients: "",
      errors: {},
      customerData: {},
      vehicleData: {},
      orderId: "",
      templateData: "",
      subject: "",
      customerEmail: "",
      searchInput: "",
      search: "",
      messageTextSentError: "",
      isEmail: false,
      isSms: false,
      phone: "",
      addonNumber: "",
      showAddonNumber: false,
      incorrectNumber: false
    };
  }

  componentDidMount = () => {
    this.setState({
      customerData: this.props.customerData,
      vehicleData: this.props.vehicleData
    });
  };

  componentDidUpdate = ({ customerData, vehicleData }) => {
    let propsCustomerData = this.props.customerData;
    let propsVehicleData = this.props.vehicleData;
    if (
      (propsCustomerData && propsCustomerData !== customerData) ||
      (propsVehicleData && propsVehicleData !== vehicleData)
    ) {
      this.setState({
        customerData: propsCustomerData,
        vehicleData: propsVehicleData,
        isEmail: propsCustomerData && propsCustomerData.email ? true : false,
        isSms:
          propsCustomerData &&
            propsCustomerData.phoneDetail &&
            propsCustomerData.phoneDetail[0].value
            ? true
            : false,
        phone:
          propsCustomerData && propsCustomerData.phoneDetail
            ? propsCustomerData.phoneDetail[0].value
            : null
      });
    }
  };

  handleChangeInput = (e, name) => {
    const { errors } = this.state;
    if (name === "subject") {
      errors.subject = "";
      this.setState({
        subject: e.target.value,
        errors
      });
    } else if (name === "addonNumber") {
      const { value } = e.target;
      this.setState({
        addonNumber: value,
        isSms: value ? true : false,
        incorrectNumber: false
      });
    } else {
      errors.email = "";
      this.setState({
        customerData: {
          ...this.state.customerData,
          [name]: e.target.value ? e.target.value : ""
        },
        isEmail: e.target.value ? true : false
        //errors
      });
    }
  };
  /** */
  handleChange = e => {
    if (e && e.value) {
      this.setState(
        {
          search: e
        },
        () => {
          this.props.searchMessageTemplateList({
            search: this.state.search.label
          });
        }
      );
    } else {
      this.setState(
        {
          search: ""
        },
        () => {
          this.props.searchMessageTemplateList();
        }
      );
    }
    if (e && e !== "") {
      let content = e.templateData.messageText;
      let contentSubject = e.templateData.subject;
      const { customerData, vehicleData } = this.state;

      const replaceObj = {
        first_name: customerData.firstName,
        last_name: customerData.lastName,
        year: vehicleData && vehicleData.year ? vehicleData.year : null,
        make: vehicleData && vehicleData.make ? vehicleData.make : null,
        model: vehicleData && vehicleData.modal ? vehicleData.modal : null
      };

      for (const key in replaceObj) {
        if (replaceObj.hasOwnProperty(key)) {
          const val = replaceObj[key];
          content = content.replace(new RegExp(`{${key}}`, "g"), val);
          contentSubject = contentSubject.replace(
            new RegExp(`{${key}}`, "g"),
            val
          );
        }
      }
      const data = {
        messageText: content,
        subject: contentSubject
      };
      this.setState({
        subject: contentSubject,
        templateData: data,
        messageTextSentError: "",
        errors: {
          subject: ""
        }
      });
    }
  };

  handlePhoneChange = e => {
    this.setState({
      phone: e.value
    });
  };

  handleShowNumber = () => {
    const { showAddonNumber } = this.state;
    this.setState({
      showAddonNumber: !showAddonNumber
    });
  };
  /** */
  loadOptions = (search, callback) => {
    this.setState({ search: search.length > 1 ? search : null });
    this.props.searchMessageTemplateList({ search, callback });
  };
  /** */
  handleSentInspection = async () => {
    const {
      customerData,
      subject,
      isEmail,
      isSms,
      phone,
      addonNumber
    } = this.state;
    const { orderReducer, profileReducer, isOrder, pdfReducer } = this.props;
    const customerId = customerData._id;
    const customerEmail = customerData.email;

    const orderTitle =
      orderReducer && orderReducer.orderItems
        ? orderReducer.orderItems.orderId
        : "Untitled order";

    const orderCreated =
      orderReducer && orderReducer.orderItems
        ? moment(orderReducer.orderItems.createdAt || "").format("MMM Do YYYY")
        : "";
    let invoiceURL, inspectionURL;
    if (pdfReducer && pdfReducer.invoiceUrl !== "") {
      invoiceURL = pdfReducer.invoiceUrl;
    } else {
      invoiceURL =
        orderReducer && orderReducer.orderItems
          ? orderReducer.orderItems.invoiceURL
          : "";
    }
    if (pdfReducer && pdfReducer.inspectionUrl !== "") {
      inspectionURL = pdfReducer.inspectionUrl;
    } else {
      inspectionURL =
        orderReducer && orderReducer.orderItems
          ? orderReducer.orderItems.inspectionURL
          : "";
    }

    const companyName = profileReducer.profileInfo.companyName || "";

    const receiverId = customerId;
    const userId = profileReducer ? profileReducer.profileInfo._id : "";
    const senderId = profileReducer.profileInfo._id;
    const subdomain = profileReducer.profileInfo.subdomain;
    const orderId =
      orderReducer && orderReducer.orderItems
        ? orderReducer.orderItems._id
        : "";
    try {
      var messageTextValue = document.getElementById("messageTextSent"),
        messageTextSent = messageTextValue.innerHTML;
      const validData = {
        subject: subject.trim(),
        email: customerEmail.trim()
      };
      if (messageTextSent.trim() === "") {
        this.setState({
          messageTextSentError: "Please enter message "
        });
      } else {
        this.setState({
          messageTextSentError: ""
        });
      }
      if (addonNumber !== "" && addonNumber.length < 13) {
        this.setState({
          incorrectNumber: true
        });
      }
      const { isValid, errors } = Validator(
        validData,
        inspectValidations,
        inspectValidationMessage
      );
      if (!isValid) {
        this.setState({
          errors: errors,
          isLoading: false
        });
        return;
      }

      const payload = {
        message: messageTextSent,
        subject: subject,
        customerId,
        email: customerEmail,
        phone: addonNumber !== "" ? (addonNumber) : (phone),
        pdf: isOrder ? invoiceURL : inspectionURL,
        orderTitle: `OrderId (#${orderTitle})`,
        companyName: companyName,
        orderCreated: orderCreated,
        isInvoice: isOrder ? true : false,
        isEmail,
        isSms,
        receiverId,
        userId,
        senderId,
        subdomain,
        orderId
      };

      if (!isEmail && !isSms) {
        await ConfirmBox({
          text: "",
          title: "Please check Mail or SMS or Both to sent notification",
          showCancelButton: false,
          confirmButtonText: "Ok"
        });
        return;
      }
      this.props.sendMessageTemplate(payload);

      // close and clear modal form
      this.props.toggle();

      this.setState({
        subject: "",
        search: "",
        templateData: [{ messageText: "" }],
        addonNumber: "",
        showAddonNumber: false
      });
    } catch (error) { }
  };
  /** */
  onKeyPress = e => {
    this.setState({
      messageTextSentError: ""
    });
  };
  /** */
  handleFocus = id => {
    document.getElementById(id).addEventListener("paste", function (e) {
      e.preventDefault();
      var text = e.clipboardData.getData("text/plain");
      document.execCommand("insertHTML", false, text);
    });
  };
  /** */
  clearForm = () => {
    this.setState({
      errors: {
        email: "",
        subject: ""
      },
      messageTextSentError: "",
      search: "",
      subject: "",
      templateData: "",
      showAddonNumber: false
    });
  };
  /** */
  handleAddtoMessage = () => {
    var messageTextValue = document.getElementById("messageTextSent"),
      messageTextSent = messageTextValue.innerHTML;
    this.props.messsageTemplateData(messageTextSent);
    // close and clear modal form
    this.props.toggle();
    this.setState({
      search: ""
    });
  };
  /**
   *
   */
  handleReminder = e => {
    const { name, checked } = e.target;
    this.setState({
      [name]: checked
    });
  };
  /**
   *
   */
  render() {
    const {
      templateData,
      recipients,
      errors,
      search,
      customerData,
      messageTextSentError,
      isEmail,
      isSms,
      incorrectNumber,
      phone,
      addonNumber,
      showAddonNumber
    } = this.state;
    const { isMessage, isOrder } = this.props;

    const email = customerData && customerData.email ? customerData.email : "";
    const phoneNumber = phone;
    const phoneArray =
      customerData && customerData.phoneDetail ? customerData.phoneDetail : "";
    const phoneOptions = [];
    for (let i = 0; i < phoneArray.length; i++) {
      phoneOptions.push({
        value: phoneArray[i].value,
        label: phoneArray[i].value
      });
    }
    return (
      <>
        <Modal
          isOpen={this.props.isOpen}
          toggle={this.props.toggle}
          backdrop={"static"}
          className="customer-modal custom-form-modal custom-modal-lg"
        >
          <ModalHeader>
            <Button className="close" onClick={this.props.toggle}>
              <span aria-hidden="true">×</span>
            </Button>
            {!isMessage && !isOrder
              ? "Send Inspection"
              : isMessage
                ? "Message Template"
                : "Send Invoice"}
          </ModalHeader>
          <ModalBody>
            <div className="">
              <Row className="justify-content-center">
                <Col md="8">
                  <Row className="justify-content-center">
                    {!this.props.isMessage ? (
                      <>
                        <Col md="12">
                          <FormGroup>
                            <Label
                              htmlFor="name"
                              className="customer-modal-text-style"
                            >
                              Recipients <span className={"asteric"}>*</span>
                            </Label>
                            <div className={"input-block"}>
                              <Input
                                type="text"
                                name="name"
                                onChange={e => this.handleChange(e)}
                                placeholder="John"
                                value={
                                  customerData ? customerData.firstName : ""
                                }
                                maxLength="50"
                                id="recipients"
                                invalid={errors.recipients && !recipients}
                                disabled
                                className={"text-capitalize"}
                              />
                              <FormFeedback>
                                {errors.recipients && !recipients
                                  ? errors.recipients
                                  : null}
                              </FormFeedback>
                            </div>
                          </FormGroup>
                        </Col>
                        <Col md="12">
                          <FormGroup>
                            <Label
                              htmlFor="name"
                              className="customer-modal-text-style"
                            >
                              Email
                              {/* <span className={"asteric"}>*</span> */}
                            </Label>
                            <div className={"input-block"}>
                              <Input
                                type="text"
                                name="customerEmail"
                                onChange={e =>
                                  this.handleChangeInput(e, "email")
                                }
                                placeholder="John@gmail.com"
                                value={
                                  customerData && customerData.email
                                    ? customerData.email
                                    : ""
                                }
                                maxLength="100"
                                id="customerEmail"
                                invalid={errors.email || false}
                              />
                              {errors.email ? (
                                <FormFeedback>{errors.email}</FormFeedback>
                              ) : null}
                            </div>
                          </FormGroup>
                        </Col>
                        <Col md="10">
                          <FormGroup className={"fleet-block"}>
                            <Label
                              htmlFor="name"
                              className="customer-modal-text-style"
                            >
                              Phone
                              {/* <span className={"asteric"}>*</span> */}
                            </Label>
                            <div className={"input-block"}>
                              {!showAddonNumber ? (
                                <Select
                                  className="basic-single"
                                  classNamePrefix="select"
                                  defaultValue={phoneOptions[0]}
                                  isSearchable={true}
                                  name="phone"
                                  options={phoneOptions}
                                  onChange={e => this.handlePhoneChange(e)}
                                />
                              ) : (
                                  <div>
                                    <MaskedInput
                                      mask={[
                                        "(",
                                        /[1-9]/,
                                        /\d/,
                                        /\d/,
                                        ")",
                                        " ",
                                        /\d/,
                                        /\d/,
                                        /\d/,
                                        "-",
                                        /\d/,
                                        /\d/,
                                        /\d/,
                                        /\d/
                                      ]}
                                      name="addonNumber"
                                      className={
                                        !incorrectNumber
                                          ? "form-control"
                                          : "form-control is-invalid"
                                      }
                                      placeholder="(555) 055-0555"
                                      size="20"
                                      value={addonNumber}
                                      maxLength={14}
                                      guide={false}
                                      onChange={e =>
                                        this.handleChangeInput(e, "addonNumber")
                                      }
                                    />

                                    {incorrectNumber ? (
                                      <FormFeedback>
                                        Phone number should not be ten or less
                                        than ten digits.
                                    </FormFeedback>
                                    ) : null}
                                  </div>
                                )}
                            </div>
                          </FormGroup>
                        </Col>
                        <Col md="2">
                          <Button
                            color={""}
                            className={"browse-btn btn-block pl-2 pr-2"}
                            size={"sm"}
                            onClick={this.handleShowNumber}
                            id={"showNumber"}
                          >
                            {!showAddonNumber ? (
                              <span>
                                <i className={"fa fa-plus mr-2 ml-1"}></i> New
                              </span>
                            ) : (
                                <span>
                                  <i className={"fa fa-redo"}></i> Remove
                              </span>
                              )}
                          </Button>
                          <UncontrolledTooltip
                            placement="top"
                            target="showNumber"
                          >
                            {!showAddonNumber
                              ? "Add New Number"
                              : "Remove Number"}
                          </UncontrolledTooltip>
                        </Col>
                      </>
                    ) : null}
                    <Col md="12">
                      <FormGroup className={"fleet-block"}>
                        <Label
                          htmlFor="name"
                          className="customer-modal-text-style"
                        >
                          Template Title
                        </Label>
                        <div className={"input-block"}>
                          <Async
                            placeholder={"Type template title"}
                            loadOptions={this.loadOptions}
                            value={search}
                            onChange={e => this.handleChange(e)}
                            isClearable={true}
                            noOptionsMessage={() =>
                              search ? (
                                "No template found"
                              ) : (
                                  <span
                                    onClick={this.props.toggleMessageTemplate}
                                    className={
                                      "text-dark font-bold cursor_pointer"
                                    }
                                  >
                                    + Add template
                                </span>
                                )
                            }
                          />
                        </div>
                      </FormGroup>
                    </Col>
                    {!this.props.isMessage ? (
                      <Col md="12">
                        <FormGroup>
                          <Label
                            htmlFor="name"
                            className="customer-modal-text-style"
                          >
                            Subject <span className={"asteric"}>*</span>
                          </Label>
                          <div className={"input-block"}>
                            <Input
                              type="text"
                              name="subject"
                              onChange={e =>
                                this.handleChangeInput(e, "subject")
                              }
                              placeholder="Inspection #1000 for your vehicle"
                              value={this.state.subject}
                              id="subject"
                              maxLength="60"
                              invalid={errors.subject ? true : false}
                            />
                            {errors.subject ? (
                              <FormFeedback>{errors.subject}</FormFeedback>
                            ) : null}
                          </div>
                        </FormGroup>
                      </Col>
                    ) : null}
                    <Col md="12">
                      <FormGroup>
                        <Label
                          htmlFor="name"
                          className="customer-modal-text-style"
                        >
                          Message <span className={"asteric"}>*</span>
                        </Label>
                        <div className={"w-100"}>
                          <div
                            className={
                              messageTextSentError &&
                                messageTextSentError !== ""
                                ? "input-block message-input-warp is-invalid"
                                : "input-block message-input-warp"
                            }
                          >
                            <p
                              suppressContentEditableWarning
                              contentEditable={"true"}
                              onKeyPress={e => this.onKeyPress(e)}
                              className={"message-input"}
                              id={"messageTextSent"}
                              dangerouslySetInnerHTML={
                                templateData
                                  ? { __html: templateData.messageText }
                                  : null
                              }
                              onClick={e => this.handleFocus("messageTextSent")}
                            />
                          </div>
                          {messageTextSentError &&
                            messageTextSentError !== "" ? (
                              <span className={" invalid-feedback "}>
                                Please enter message
                            </span>
                            ) : null}
                        </div>
                      </FormGroup>
                    </Col>
                  </Row>
                </Col>
                <Col md="4">
                  {!this.props.isMessage ? (
                    <SendEmailAndSMS
                      headingTitle={"Send Notification"}
                      handleReminder={this.handleReminder}
                      isEmail={isEmail}
                      isSms={isSms}
                      email={email}
                      phone={phoneNumber}
                    />
                  ) : null}
                </Col>
              </Row>
            </div>
            <div>
              <span
                className={"btn btn-secondary btn-dashed ml-5 mb-4"}
                onClick={this.props.toggleMessageTemplate}
              >
                Manage Template
              </span>
            </div>
          </ModalBody>
          <ModalFooter>
            <div className={"flex-1"}>
              <div className="required-fields">*Fields are Required.</div>
            </div>
            {!isMessage ? (
              <Button color="primary" onClick={this.handleSentInspection}>
                {isOrder ? "Send Invoice" : "Send Inspection"}
              </Button>
            ) : (
                <Button color="primary" onClick={this.handleAddtoMessage}>
                  Add to message
              </Button>
              )}{" "}
            <Button
              color="secondary"
              onClick={e => {
                this.props.toggle();
                this.clearForm();
              }}
            >
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </>
    );
  }
}

export default SendInspection;
