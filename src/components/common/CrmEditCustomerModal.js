import React, { Component } from "react";
import * as classnames from "classnames";
import MaskedInput from "react-text-mask";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Col,
  FormGroup,
  //InputGroup,
  Label,
  Input,
  FormFeedback
} from "reactstrap";
import Select from "react-select";
//import { AppSwitch } from "@coreui/react";
import { CrmFleetModal } from "../common/CrmFleetModal";
import { CrmStandardModel } from "../common/CrmStandardModel";
import { PhoneOptions, DefaultErrorMessage } from "../../config/Constants";
import {
  CustomerDefaultPermissions,
  //CustomerPermissionsText
} from "../../config/Constants";
import { AppConfig } from "../../config/AppConfig";
import {
  CreateCustomerValidations,
  CreateCustomerValidMessaages,
  CreateRateValidations,
  CreateRateValidMessaages
} from "../../validations";
import { logger } from "../../helpers/Logger";
import Validator from "js-object-validation";
//import Async from "react-select/lib/Async";
import { ApiHelper } from "../../helpers/ApiHelper";
import { toast } from "react-toastify";
import LastUpdated from "../common/LastUpdated";
import { ReferralSource } from "../../config/Constants";

export class CrmEditCustomerModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOption: {},
      expandForm: false,
      fleetModalOpen: false,
      firstName: "",
      lastName: "",
      phoneDetail: [
        {
          phone: "mobile",
          value: ""
        }
      ],
      email: "",
      notes: "",
      companyName: "",
      referralSource: "",
      fleet: "",
      address1: "",
      address2: "",
      city: "",
      state: "",
      zipCode: "",
      customerDefaultPermissions: CustomerDefaultPermissions,
      errors: {},
      phoneErrors: [""],
      phoneLength: AppConfig.phoneLength,
      openStadardRateModel: false,
      defaultOptions: [{ value: "", label: "Add New Customer" }],
      selectedPriceMatrix: { value: "", label: "Type to select" },
      selectedLabourRate: { value: "", label: "Select..." },
      percentageError: "",
      inCorrectNumber: [],
      fleet1: {}
    };
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.customer &&
      this.props.customer._id &&
      ((prevProps.customer !== this.props.customer) || (prevProps.customerModalOpen !== this.props.customerModalOpen))
    ) {
      const { customer } = this.props;
      this.setState({
        address1: customer.address1,
        city: customer.city,
        companyName: customer.companyName,
        email: customer.email,
        firstName: customer.firstName,
        lastName: customer.lastName,
        notes: customer.notes,
        customerDefaultPermissions: customer.permission,
        referralSource: customer.referralSource,
        state: customer.state,
        zipCode: customer.zipCode,
        phoneDetail:
          customer.phoneDetail && customer.phoneDetail.length
            ? customer.phoneDetail
            : [
              {
                phone: "mobile",
                value: ""
              }
            ],
        inCorrectNumber: []
      });
      if (
        this.props.customer.customerDefaultPermissions &&
        this.props.customer.customerDefaultPermissions.shouldPricingMatrixOverride
          .pricingMatrix !== null &&
        this.props.customer.customerDefaultPermissions.shouldPricingMatrixOverride
          .pricingMatrix !== "objectId"
      ) {
        const { matrixListReducerData, customer } = this.props
        const pricingMatrixValue = customer.customerDefaultPermissions.shouldPricingMatrixOverride.pricingMatrix
        const selectedMatrix = matrixListReducerData.filter(matrix => matrix._id === pricingMatrixValue)
        this.setState({
          selectedPriceMatrix: {
            value: selectedMatrix[0]._id,
            label: selectedMatrix[0].matrixName
          }
        })
      } else {
        this.setState({
          selectedPriceMatrix: {
            value: "",
            label: "Type to select"
          }
        })
      }

      if (
        customer.permission &&
        customer.permission.shouldLaborRateOverride.laborRate !== null &&
        customer.permission.shouldLaborRateOverride.laborRate !== "objectId"
      ) {
        this.handleGetRateData(
          customer.permission.shouldLaborRateOverride.laborRate
        );
      }
      if (customer.fleet && customer.fleet._id) {
        this.setState({
          selectedOption: {
            value: customer.fleet._id,
            label: customer.fleet.companyName
          },
          fleet: customer.fleet._id,
          fleet1: {
            _id: customer.fleet._id,
            companyName: customer.fleet.companyName
          }
        });
      } else {
        this.setState({
          selectedOption: {
            value: "",
            label: "Select..."
          },
          fleet1: null
        });
      }
    }
  }
  handleGetRateData = async rateId => {
    let api = new ApiHelper();
    try {
      const data = {
        rateId: rateId
      };
      let result = await api.FetchFromServer(
        "/labour",
        "/getSingleRate",
        "POST",
        true,
        undefined,
        data
      );
      if (result.isError) {
        toast.error(result.messages[0] || DefaultErrorMessage);
      } else {
        toast.success(result.messages[0]);
        this.setState({
          selectedLabourRate: {
            value: result.data.data._id,
            label: result.data.data.name + " - " + result.data.data.hourlyRate
          }
        });
      }
    } catch (error) {
      logger(error);
    }
  };

  setStateAsync(state) {
    return new Promise(resolve => {
      this.setState(state, resolve);
    });
  }

  handleClick(singleState, e) {
    const { customerDefaultPermissions } = this.state;
    customerDefaultPermissions[singleState].status = e.target.checked;
    this.setState({
      ...customerDefaultPermissions
    });
  }

  handleRateAdd = async data => {
    const profileData = this.props.profileInfo.profileInfo;
    let api = new ApiHelper();

    try {
      const { isValid, errors } = Validator(
        data,
        CreateRateValidations,
        CreateRateValidMessaages
      );
      if (!isValid) {
        this.setState({
          errors: errors,
          isLoading: false
        });
        return;
      } else {
        const ratedata = {
          data: data,
          userId: profileData._id,
          parentId: profileData.parentId
        };
        let result = await api.FetchFromServer(
          "/labour",
          "/addRate",
          "POST",
          true,
          undefined,
          ratedata
        );
        if (result.isError) {
          toast.error(result.messages[0] || DefaultErrorMessage);
        } else {
          toast.success(result.messages[0]);
          this.setState({
            openStadardRateModel: !this.state.openStadardRateModel,
            selectedLabourRate: {
              value: result.data.data._id,
              label: result.data.data.name + " - " + result.data.data.hourlyRate
            }
          });
          this.props.onStdAdd();
        }
      }
    } catch (error) {
      // logger(error);
    }
  };

  handlePercentageChange = e => {
    if (parseFloat(e.target.value) >= 100) {
      this.setState({
        percentageError: "Enter proper percentage value,less than 100"
      })
    } else {
      this.setState({
        percentageError: ""
      })
    }
    const { customerDefaultPermissions } = this.state;
    customerDefaultPermissions["shouldReceiveDiscount"].percentageDiscount =
      e.target.value;
    this.setState({
      ...customerDefaultPermissions
    });
  };
  handleMatrixChange = e => {
    const { customerDefaultPermissions } = this.state;
    customerDefaultPermissions["shouldPricingMatrixOverride"].pricingMatrix =
      e.target.value;
    this.setState({
      ...customerDefaultPermissions
    });
  };

  handleChange = selectedOption => {
    if (selectedOption) {
      this.setState({
        selectedOption: selectedOption,
        fleet: selectedOption.value,
        fleet1: {
          _id: selectedOption.value,
          companyName: selectedOption.label
        }
      });
    } else {
      this.setState({
        selectedOption: {
          value: "",
          label: "Select.."
        },
        fleet: "",
        fleet1: {}
      });
    }
  };

  handleInputChange = e => {
    const { target } = e;
    const { name, value } = target;
    this.setState({
      [name]: name === "firstName" || name === "lastName" ? value.charAt(0).toUpperCase() +
        value.substring(1) : value,
      errors: {
        ...this.state.errors,
        [name]: null
      }
    });
  };
  stdModelFun = () => {
    this.setState({
      openStadardRateModel: !this.state.openStadardRateModel
    });
  };
  handlePhoneNameChange = (index, event) => {
    const { value } = event.target;
    const phoneDetail = [...this.state.phoneDetail];
    phoneDetail[index].phone = value;
    this.setState({
      phoneDetail
    });
  };
  handlePhoneValueChange = (index, event) => {
    const { value } = event.target;
    const IncorrectNumber = [...this.state.inCorrectNumber]
    IncorrectNumber[index] = false
    this.setState({
      inCorrectNumber: IncorrectNumber
    })
    const phoneDetail = [...this.state.phoneDetail];
    phoneDetail[index].value = value;
    this.setState({
      phoneDetail
    });
  };

  handleAddPhoneDetails = () => {
    const { phoneDetail } = this.state;
    if (phoneDetail.length < 3) {
      this.setState((state, props) => {
        return {
          phoneDetail: state.phoneDetail.concat([
            {
              phone: "mobile",
              value: ""
            }
          ]),
          phoneErrors: state.phoneErrors.concat([""]),
          inCorrectNumber: state.inCorrectNumber.concat([false])
        };
      });
    }
  };

  handleRemovePhoneDetails = index => {
    const { phoneDetail, phoneErrors, inCorrectNumber } = this.state;
    let t = [...phoneDetail];
    let u = [...phoneErrors];
    let v = [...inCorrectNumber];
    t.splice(index, 1);
    u.splice(index, 1);
    v.splice(index, 1);
    if (phoneDetail.length) {
      this.setState({
        phoneDetail: t,
        phoneErrors: u,
        inCorrectNumber: v
      });
    }
  };

  handleStandardRate = selectValue => {
    if (selectValue) {
      if (selectValue.value === "") {
        this.setState({
          openStadardRateModel: !this.state.openStadardRateModel
        });
      } else {
        const { customerDefaultPermissions } = this.state;
        customerDefaultPermissions["shouldLaborRateOverride"].laborRate =
          selectValue.value;
        this.setState({
          ...customerDefaultPermissions,
          selectedLabourRate: selectValue
        });
        //this.props.setDefaultRate(selectValue);
      }
    } else {
      this.props.onTypeHeadStdFun({});
      this.setState({
        selectedLabourRate: {
          value: "",
          label: "Select..."
        }
      });
    }
  };

  loadOptions = async input => {
    return this.props.loadTypeRate(input);
  };

  updateNewCustomer = async () => {
    const {
      firstName,
      lastName,
      phoneDetail,
      email,
      notes,
      companyName,
      referralSource,
      address1,
      address2,
      city,
      state,
      zipCode,
      customerDefaultPermissions,
      fleet,
      fleet1
    } = this.state;
    let validationdata;
    if (!email) {
      validationdata = {
        firstName: firstName.trim()
      };
    } else {
      validationdata = {
        firstName: firstName.trim(),
        email: email
      };
    }
    const customerData = {
      firstName: firstName,
      lastName: lastName,
      phoneDetail: phoneDetail,
      email: email,
      notes: notes,
      companyName: companyName,
      referralSource: referralSource,
      fleet: fleet === "" ? null : fleet,
      address1: address1,
      address2: address2,
      city: city,
      state: state,
      zipCode: zipCode,
      permission: customerDefaultPermissions,
      fleet1: fleet1
    };

    try {
      if (phoneDetail.length) {
        let t = [];
        this.setState({ phoneErrors: t });
        await Promise.all(
          phoneDetail.map(async (key, i) => {
            if (key.value.length) {
              // t[i] = null
            } else {
              t[i] = "Phone number is required";
            }
          })
        );
        await this.setStateAsync({ phoneErrors: t });
      }
      let { isValid, errors } = Validator(
        validationdata,
        CreateCustomerValidations,
        CreateCustomerValidMessaages
      );
      let IncorrectNumber = [...this.state.inCorrectNumber]
      if (phoneDetail && phoneDetail.length) {
        for (let i = 0; i < phoneDetail.length; i++) {
          if (!this.state.phoneErrors[i]) {
            const phoneTrimed = (phoneDetail[i].value.replace(/[- )(_]/g, ""))
            if (phoneTrimed.length <= 9) {
              IncorrectNumber[i] = true
              this.setState({
                inCorrectNumber: IncorrectNumber
              });
              isValid = false;
            }
          }
        }
      }
      if (
        !isValid ||
        Object.keys(this.state.phoneErrors).length > 0 ||
        customerData.firstName.trim() === "" || this.state.percentageError
      ) {
        this.setState({
          errors: errors,
          isLoading: false
        });
        return;
      }
      this.props.addCustomerFun(customerData);
    } catch (error) {
      // logger(error);
    }
  };

  async removeAllState() {
    this.setState({
      firstName: "",
      lastName: "",
      phoneDetail: "",
      email: "",
      notes: "",
      companyName: "",
      referralSource: "",
      address1: "",
      address2: "",
      city: "",
      state: "",
      zipCode: "",
      fleet: "",
      errors: {},
      phoneErrors: [""],
      customerDefaultPermissions: CustomerDefaultPermissions,
      inCorrectNumber: [],
      fleet1: {}
    });
  }

  handleCustomerModal = () => {
    const { customerModalOpen } = this.props;
    if (customerModalOpen) {
      this.setState({
        errors: {}
      });
    }
    this.props.handleCustomerModalFun();
  };

  matrixLoadOptions = (input, callback) => {
    this.props.getPriceMatrix({ input, callback });
  }
  handlePriceMatrix = (e) => {
    if (e && e.value) {
      const { customerDefaultPermissions } = this.state;
      customerDefaultPermissions["shouldPricingMatrixOverride"].pricingMatrix =
        e.value;
      this.setState({
        ...customerDefaultPermissions,
        selectedPriceMatrix: {
          value: e.value,
          label: e.label
        }
      })
    } else {
      this.setState({
        selectedPriceMatrix: {
          value: "",
          label: "Type to select"
        }
      })
    }
  }

  render() {
    const {
      customerModalOpen,
      //rateStandardListData,
      getCustomerFleetList,
      customer,
      isCustVehiclemodal
    } = this.props;
    const {
      selectedOption,
      fleetModalOpen,
      phoneDetail,
      errors,
      firstName,
      lastName,
      email,
      referralSource
      //selectedLabourRate,
      //selectedPriceMatrix,
      //percentageError
    } = this.state;
    let customerDefaultPermissions = this.state.customerDefaultPermissions;
    if (!customerDefaultPermissions) {
      customerDefaultPermissions = {};
      for (const key in CustomerDefaultPermissions) {
        if (CustomerDefaultPermissions.hasOwnProperty(key)) {
          const element = CustomerDefaultPermissions[key];
          customerDefaultPermissions[key] = element;
        }
      }
    }

    const phoneOptions = PhoneOptions.map((item, index) => {
      return (
        <option key={index} value={item.key}>
          {item.text}
        </option>
      );
    });
    const options = [];
    getCustomerFleetList.map((data, index) => {
      options.push({ value: `${data._id}`, label: `${data.companyName}` });
      return true;
    });
    return (
      <>
        <Modal
          isOpen={customerModalOpen}
          toggle={this.handleCustomerModal}
          className="customer-modal custom-form-modal custom-modal-lg"
        >
          <ModalHeader toggle={this.handleCustomerModal}>
            {"Update Customer"}
            {customer && customer.updatedAt ?
              <LastUpdated updatedAt={customer.updatedAt} /> :
              null
            }
            {
              isCustVehiclemodal ?
                <div className={"step-align"}>
                  Step 1/2
                </div>
                : null
            }
          </ModalHeader>
          <ModalBody>
            <div className="">
              <Row className="justify-content-center">
                <Col md="6">
                  <FormGroup>
                    <Label htmlFor="name" className="customer-modal-text-style">
                      First Name <span className={"asteric"}>*</span>
                    </Label>
                    <div className={"input-block"}>
                      <Input
                        type="text"
                        placeholder="John"
                        name="firstName"
                        onChange={this.handleInputChange}
                        value={firstName}
                        maxLength="30"
                        invalid={!(firstName.trim()) && errors.firstName ? true : false}
                      />
                      <FormFeedback>
                        {!(firstName.trim()) && errors.firstName
                          ? errors.firstName
                          : null}
                      </FormFeedback>
                      {/* {!firstName && errors.firstName ? (
                        <p className="text-danger">{errors.firstName}</p>
                      ) : null} */}
                    </div>
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <Label htmlFor="name" className="customer-modal-text-style">
                      Last Name
                    </Label>
                    <div className={"input-block"}>
                      <Input
                        type="text"
                        placeholder="Doe"
                        onChange={this.handleInputChange}
                        name="lastName"
                        value={this.state.lastName}
                        maxLength="30"
                      />
                      {errors.lastName && !lastName ? (
                        <p className="text-danger">{errors.lastName}</p>
                      ) : null}
                    </div>
                  </FormGroup>
                </Col>
              </Row>
            </div>
            <div className="">
              <Row className="">
                {/* <Row className="justify-content-center"> */}
                {phoneDetail && phoneDetail.length
                  ? phoneDetail.map((item, index) => {
                    return (
                      <React.Fragment key={index}>
                        {index < 1 ? (
                          <>
                            <Col md="6">
                              <FormGroup className="phone-number-feild">
                                <Label
                                  htmlFor="name"
                                  className="customer-modal-text-style"
                                >
                                  Phone <span className={"asteric"}>*</span>
                                </Label>
                                <Input
                                  onChange={e =>
                                    this.handlePhoneNameChange(index, e)
                                  }
                                  type="select"
                                  id="name"
                                  required
                                  value={item.phone}
                                >
                                  {phoneOptions}
                                </Input>
                                {phoneDetail[index].phone === "mobile" ? (
                                  <div className="input-block select-number-tile">
                                    <MaskedInput
                                      mask={['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                                      name="phoneDetail"
                                      placeholder="(555) 055-0555"
                                      className={classnames("form-control", {
                                        "is-invalid":
                                          (this.state.phoneErrors[index] !== "" &&
                                            !item.value) || (this.state.inCorrectNumber[index])
                                      })}
                                      size="20"
                                      value={item.value}
                                      guide={false}
                                      onChange={e =>
                                        this.handlePhoneValueChange(index, e)
                                      }
                                    />
                                    <FormFeedback>
                                      {this.state.phoneErrors[index]}
                                      {
                                        this.state.inCorrectNumber[index] ? "Phone number should not be less than ten digit." : null
                                      }
                                    </FormFeedback>
                                  </div>
                                ) : (
                                    <div className="input-block select-number-tile">
                                      <MaskedInput
                                        mask={['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, ' ', 'ext', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]}
                                        name="phoneDetail"
                                        className="form-control"
                                        placeholder="(555) 055-0555 ext 1234"
                                        size="20"
                                        value={item.value}
                                        guide={false}
                                        onChange={e =>
                                          this.handlePhoneValueChange(index, e)
                                        }
                                      />
                                      <FormFeedback>
                                        {this.state.phoneErrors[index]}
                                        {
                                          this.state.inCorrectNumber[index] ? "Phone number should not be less than ten digit." : null
                                        }
                                      </FormFeedback>
                                    </div>
                                  )}
                              </FormGroup>
                            </Col>
                            <Col md="6">
                              <FormGroup>
                                <Label
                                  htmlFor="name"
                                  className="customer-modal-text-style"
                                >
                                  Email
                                  </Label>
                                <div className="input-block">
                                  <Input
                                    type="text"
                                    className="customer-modal-text-style"
                                    placeholder="john.doe@example.com"
                                    onChange={this.handleInputChange}
                                    name="email"
                                    value={this.state.email}
                                    maxLength="100"
                                    invalid={errors.email && email ? true : false}
                                  />
                                  <FormFeedback>
                                    {errors.email && email ? errors.email : null}
                                  </FormFeedback>
                                  {/* {errors.email && email ? (
                                    <span className="text-danger">
                                      {errors.email}
                                    </span>
                                  ) : null} */}
                                </div>
                              </FormGroup>
                            </Col>
                          </>
                        ) : (
                            <>
                              <Col md="6">
                                <button
                                  onClick={() =>
                                    this.handleRemovePhoneDetails(index)
                                  }
                                  className="btn btn-danger btn-sm btn-round input-close"
                                >
                                  <i className="fa fa-close" />
                                </button>
                                <FormGroup className="phone-number-feild">
                                  <Label
                                    htmlFor="name"
                                    className="customer-modal-text-style"
                                  >
                                    Phone
                                  </Label>
                                  {/* <div></div> */}
                                  <Input
                                    onChange={e =>
                                      this.handlePhoneNameChange(index, e)
                                    }
                                    type="select"
                                    id="name"
                                    required
                                    value={item.phone}
                                  >
                                    {phoneOptions}
                                  </Input>
                                  {phoneDetail[index].phone === "mobile" ? (
                                    <div className="input-block select-number-tile">
                                      <MaskedInput
                                        mask={['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                                        name="phoneDetail"
                                        placeholder="(555) 055-0555"
                                        className={classnames("form-control", {
                                          "is-invalid":
                                            (this.state.phoneErrors[index] !== "" &&
                                              !item.value) || (this.state.inCorrectNumber[index])
                                        })}
                                        size="20"
                                        value={item.value}
                                        guide={false}
                                        onChange={e =>
                                          this.handlePhoneValueChange(index, e)
                                        }
                                      />
                                      <FormFeedback>
                                        {this.state.phoneErrors[index]}
                                        {
                                          this.state.inCorrectNumber[index] ? "Phone number should not be less than ten digit." : null
                                        }
                                      </FormFeedback>
                                    </div>
                                  ) : (
                                      <div className="input-block select-number-tile">
                                        <MaskedInput
                                          mask={['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, ' ', 'ext', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]}
                                          name="phoneDetail"
                                          className="form-control"
                                          placeholder="(555) 055-0555 ext 1234"
                                          size="20"
                                          value={item.value}
                                          guide={false}
                                          onChange={e =>
                                            this.handlePhoneValueChange(index, e)
                                          }
                                        />
                                        <FormFeedback>
                                          {this.state.phoneErrors[index]}
                                          {
                                            this.state.inCorrectNumber[index] ? "Phone number should not be less than ten digit." : null
                                          }
                                        </FormFeedback>
                                      </div>
                                    )}
                                </FormGroup>
                              </Col>
                            </>
                          )}
                      </React.Fragment>
                    );
                  })
                  : null}

                {phoneDetail.length < 3 ? (
                  <Col md="12">
                    <FormGroup className="mb-0">
                      <Label />
                      <span
                        onClick={this.handleAddPhoneDetails}
                        className="customer-add-phone customer-anchor-text customer-click-btn"
                      >
                        Add another phone number
                      </span>
                    </FormGroup>
                  </Col>
                ) : null}
              </Row>
            </div>

            <div className="">
              <Row>
                <Col md="6">
                  <FormGroup>
                    <Label htmlFor="name" className="customer-modal-text-style">
                      Company
                    </Label>
                    <Input
                      type="text"
                      placeholder="Company"
                      name="companyName"
                      onChange={this.handleInputChange}
                      value={this.state.companyName}
                      maxLength="100"
                    />
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <Label htmlFor="name" className="customer-modal-text-style">
                      Fleet
                    </Label>
                    <Select
                      defaultValue={{ label: "Select..", value: "" }}
                      value={selectedOption}
                      onChange={this.handleChange}
                      className={"w-100 form-select"}
                      classNamePrefix={"form-select-theme"}
                      isClearable={selectedOption.value !== "" ? true : false}
                      options={options}
                    />
                  </FormGroup>
                </Col>
              </Row>
            </div>
            {/* <div className="">
              <Row className="justify-content-center">
                <div>
                  {!expandForm ? (
                    <span
                      onClick={this.handleExpandForm}
                      className="customer-anchor-text customer-click-btn"
                    >
                      {" "}
                      Show More{" "}
                    </span>
                  ) : (
                      ""
                    )}
                </div>
              </Row>
            </div> */}
            {/* {expandForm ? (
              <> */}
            <div className="">
              <Row className="">
                <Col md="6">
                  <FormGroup>
                    <Label
                      htmlFor="name"
                      className="customer-modal-text-style"
                    >
                      Address
                        </Label>
                    <Input
                      type="text"
                      placeholder="Address"
                      name="address1"
                      value={this.state.address1}
                      onChange={this.handleInputChange}
                      maxLength="200"
                    />
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <Label
                      htmlFor="name"
                      className="customer-modal-text-style"
                    >
                      City
                        </Label>
                    <Input
                      type="text"
                      placeholder="New York"
                      name="city"
                      onChange={this.handleInputChange}
                      value={this.state.city}
                      maxLength="30"
                    />
                  </FormGroup>
                </Col>
              </Row>
            </div>
            <div className="">
              <Row className="">
                <Col md="6">
                  <FormGroup>
                    <Label
                      htmlFor="name"
                      className="customer-modal-text-style"
                    >
                      State
                        </Label>
                    <Input
                      type="text"
                      name="state"
                      value={this.state.state}
                      onChange={this.handleInputChange}
                      placeholder="NY"
                      maxLength="30"
                    />
                  </FormGroup>
                </Col>
                <Col md="6 ">
                  <FormGroup>
                    <Label
                      htmlFor="name"
                      className="customer-modal-text-style"
                    >
                      Zip Code
                        </Label>
                    <Input
                      type="text"
                      placeholder="Zip Code"
                      name="zipCode"
                      onChange={this.handleInputChange}
                      value={this.state.zipCode}
                      maxLength="6"
                    />
                  </FormGroup>
                </Col>
              </Row>
            </div>
            <div className="">
              <Row className="">
                <Col md="6">
                  <FormGroup>
                    <Label
                      htmlFor="name"
                      className="customer-modal-text-style"
                    >
                      Referral Source
                        </Label>
                    <div className={"input-block"}>
                      <Input
                        type="select"
                        placeholder="Referral"
                        name="referralSource"
                        value={referralSource}
                        onChange={this.handleInputChange}
                        maxLength="100"
                      >
                        <option value={""}>Select</option>
                        {ReferralSource.length
                          ? ReferralSource.map((item, index) => {
                            return (
                              <option
                                selected={item.key === referralSource}
                                value={item.key}
                                key={index}
                              >
                                {item.text}
                              </option>
                            );
                          })
                          : null}
                      </Input>
                    </div>
                  </FormGroup>
                </Col>
              </Row>
            </div>
            {/* <Row className="custom-label-padding ">
              {CustomerPermissionsText
                ? CustomerPermissionsText.map((permission, index) => {
                  let discountShow = false;
                  let labourRate = false;
                  let pricingMatrix = false;
                  if (
                    permission.key === "shouldReceiveDiscount" &&
                    customerDefaultPermissions[permission.key].status
                  ) {
                    discountShow = true;
                  }

                  if (
                    permission.key === "shouldLaborRateOverride" &&
                    customerDefaultPermissions[permission.key].status
                  ) {
                    labourRate = true;
                  }

                  if (
                    permission.key === "shouldPricingMatrixOverride" &&
                    customerDefaultPermissions[permission.key].status
                  ) {
                    pricingMatrix = true;
                  }
                  return (
                    <React.Fragment key={index}>
                      <Col
                        md="6"
                        key={index}
                        className={
                          permission.key === "shouldPricingMatrixOverride"
                            ? "price-matrix"
                            : null
                        }
                      >
                        <div className="d-flex">
                          <AppSwitch
                            className={"mx-1"}
                            checked={
                              customerDefaultPermissions[permission.key]
                                .status
                            }
                            onClick={this.handleClick.bind(
                              this,
                              permission.key
                            )}
                            variant={"3d"}
                            color={"primary"}
                            size={"sm"}
                          />
                          <p className="customer-modal-text-style">
                            {permission.text}
                          </p>
                        </div>
                        {discountShow ? (
                          <div
                            className="custom-label  d-flex col-12"
                            key={index}
                          >
                            <Label
                              htmlFor="name"
                              className="customer-modal-text-style mr-2 text-nowrap"
                            >
                              Percent Discount
                            </Label>
                            <FormGroup>
                              <Col md="6" className={"p-0"}>
                                <div className={"input-block"}>
                                  <InputGroup>
                                    <Input
                                      placeholder="00.00"
                                      name="percentageDiscount"
                                      maxLength="5"
                                      onChange={this.handlePercentageChange}
                                      className="form-control"
                                      invalid={customerDefaultPermissions[permission.key]
                                        .percentageDiscount && percentageError}
                                      value={
                                        customerDefaultPermissions[
                                          permission.key
                                        ].percentageDiscount
                                      }
                                    />

                                    <div className="input-group-append">
                                      <span className="input-group-text">
                                        <i className="fa fa-percent"></i>
                                      </span>
                                    </div>
                                  </InputGroup>
                                  <p className="text-danger text-nowrap">
                                    {customerDefaultPermissions[permission.key]
                                      .percentageDiscount && percentageError
                                      ? percentageError
                                      : null}
                                  </p>
                                </div>
                              </Col>
                            </FormGroup>
                          </div>
                        ) : null}
                        {labourRate ? (
                          <Col
                            md=""
                            className={"fleet-block rate-standard-list"}
                          >
                            <Async
                              defaultOptions={
                                rateStandardListData.standardRateList
                              }
                              loadOptions={this.loadOptions}
                              onChange={this.handleStandardRate}
                              isClearable={
                                selectedLabourRate &&
                                  selectedLabourRate.value !== ""
                                  ? true
                                  : false
                              }
                              value={selectedLabourRate}
                            />
                          </Col>
                        ) : null}
                        {pricingMatrix ? (
                          <Col
                            md=""
                            className={"fleet-block rate-standard-list"}
                          >
                            <Async
                              placeholder={"Type to select price matrix"}
                              loadOptions={this.matrixLoadOptions}
                              onChange={(e) => this.handlePriceMatrix(e)}
                              isClearable={selectedPriceMatrix && selectedPriceMatrix.value ? true : false}
                              value={selectedPriceMatrix}
                              noOptionsMessage={() => "Type price matrix name"
                              }
                            />
                          </Col>
                        ) : null}
                      </Col>
                    </React.Fragment>
                  );
                })
                : null}
            </Row> */}
            {fleetModalOpen ? <CrmFleetModal /> : ""}
            <CrmStandardModel
              openStadardRateModel={this.state.openStadardRateModel}
              stdModelFun={this.stdModelFun}
              errors={errors}
              handleRateAdd={this.handleRateAdd}
            />
          </ModalBody>
          <ModalFooter>
            <div className="required-fields">*Fields are Required.</div>
            <div className={isCustVehiclemodal ? "btn-reverse" : "btn-forward"}>
              <Button color="primary" onClick={this.updateNewCustomer}>
                {
                  isCustVehiclemodal ? "Update Customer and Continue >" :
                    "Update Customer"
                }
              </Button>{" "}
              <Button color="secondary" onClick={this.handleCustomerModal}>
                Cancel
            </Button>
            </div>
          </ModalFooter>
        </Modal>
      </>
    );
  }
}
