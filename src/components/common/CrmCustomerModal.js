import React, { Component } from "react";
// import Validator from "js-object-validation";
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
import { ReferralSource } from "../../config/Constants";

export class CrmCustomerModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOption: "",
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
      customerDefaultPermissions: Object.assign({}, CustomerDefaultPermissions),
      errors: {},
      phoneErrors: [""],
      phoneLength: AppConfig.phoneLength,
      openStadardRateModel: false,
      defaultOptions: [{ value: "", label: "Add New Customer" }],
      selectedPriceMatrix: { value: "", label: "Type to select" },
      selectedLabourRate: { value: "", label: "Select..." },
      modalIsOpen: true,
      percentageError: "",
      inCorrectNumber: [],
      fleet1: {}
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.customerModalOpen !== this.props.customerModalOpen) {
      this.removeAllState();
    }
  }

  setStateAsync(state) {
    return new Promise(resolve => {
      this.setState(state, resolve);
    });
  }

  handleClick(singleState, e) {
    const { customerDefaultPermissions } = this.state;
    customerDefaultPermissions[singleState].status = e.target.checked;
    this.setState({
      modalIsOpen: false
    })
    if (singleState === "shouldLaborRateOverride") {
      if (!this.state.selectedLabourRate.length) {
        this.setState({
          selectedLabourRate: { value: "", label: "Select..." },
        });
      }
    }
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
          this.props.setDefaultRate({ value: result.data.data._id, label: result.data.data.name });
        }
      }
    } catch (error) {
      logger(error);
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
          label: "Select..."
        },
        fleet: "",
        fleet1: null
      });
    }
  };

  handleExpandForm = () => {
    this.setState({
      expandForm: !this.state.expandForm
    });
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
    if (phoneDetail.length < 10) {
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
    let v = [...inCorrectNumber]
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

        this.props.setDefaultRate(selectValue);
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

  addNewCustomer = async () => {
    try {
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

      const customerData = {
        firstName: firstName,
        lastName: lastName,
        phoneDetail: phoneDetail,
        email: email,
        notes: notes,
        companyName: companyName,
        referralSource: referralSource,
        address1: address1,
        address2: address2,
        city: city,
        state: state,
        zipCode: zipCode,
        fleet: fleet,
        permission: customerDefaultPermissions,
        status: true,
        fleet1: fleet1
      };
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
      let validationData = {
        firstName: firstName.trim()
      };
      if (email !== "") {
        validationData.email = email;
      }
      let { isValid, errors } = Validator(
        validationData,
        CreateCustomerValidations,
        CreateCustomerValidMessaages
      );
      this.setState({ errors: {} });
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
        customerData.firstName === "" || this.state.percentageError
      ) {
        this.setState({
          errors: errors,
          isLoading: false
        });
        return;
      }
      this.props.addCustomerFun(customerData);
    } catch (error) {
      logger(error);
    }
  };

  async removeAllState() {
    this.setState({
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
      address1: "",
      address2: "",
      city: "",
      state: "",
      zipCode: "",
      fleet: "",
      errors: {},
      customerDefaultPermissions: Object.assign({}, CustomerDefaultPermissions),
      phoneErrors: [""],
      expandForm: false,
      openStadardRateModel: false,
      defaultOptions: [{ value: "", label: "Add New Customer" }],
      selectedPriceMatrix: { value: "", label: "Type to select" },
      selectedLabourRate: { value: "", label: "Select..." },
      modalIsOpen: true,
      percentageError: "",
      inCorrectNumber: [],
      fleet1: {}
    });
  }

  handleCustomerModal = () => {
    this.props.handleCustomerModalFun();
    if (this.props.customerModalOpen) {
      //this.removeAllState();
    }
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
      isCustVehiclemodal
    } = this.props;
    const {
      selectedOption,
      //expandForm,
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
    const phoneOptions = PhoneOptions.map((item, index) => {
      return (
        <option value={item.key} key={index}>
          {item.text}
        </option>
      );
    });

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
    const options = [];
    getCustomerFleetList &&
      getCustomerFleetList.map((data, index) => {
        options.push({ value: `${data._id}`, label: `${data.companyName}` });
        return true;
      });
    return (
      <>
        <Modal
          isOpen={customerModalOpen}
          toggle={this.handleCustomerModal}
          className={"customer-modal custom-form-modal custom-modal-lg"}
        >
          <ModalHeader toggle={this.handleCustomerModal}>
            {"Create New Customer"}
            {
              isCustVehiclemodal ?
                <div className={"step-align"}>Step 1/2</div> :
                null
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
              <Row className="">
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
                                {/* <div></div> */}

                                <Input
                                  onChange={e =>
                                    this.handlePhoneNameChange(index, e)
                                  }
                                  type="select"
                                  id="name"
                                  required
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
                                            !item.value) || (this.state.inCorrectNumber[index] === true)
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
                                        mask={['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, ' ', 'ext', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]}
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
                                    <p className="text-danger">
                                      {errors.email}
                                    </p>
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

                {phoneDetail.length < 10 ? (
                  <Col md="12">
                    <FormGroup className={"mb-0"}>
                      <Label className={"customer-modal-text-style"} />
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
                  <FormGroup className={"fleet-block"}>
                    <Label htmlFor="name" className="customer-modal-text-style">
                      Fleet
                    </Label>
                    <Select
                      value={selectedOption}
                      onChange={this.handleChange}
                      className="w-100 form-select"
                      options={options}
                      isClearable={selectedOption.value !== "" ? true : false}
                    />
                  </FormGroup>
                </Col>
              </Row>
              {/* <Row className="justify-content-center">
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
              </Row> */}
            </div>
            {/* {expandForm ? (
              <> */}
            <Row className="justify-content-center">
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
                    maxLength="30"
                  />
                </FormGroup>
              </Col>
            </Row>
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
                    maxLength="6"
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
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
                                .status && !this.state.modalIsOpen
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
                        {discountShow && !this.state.modalIsOpen ? (
                          <div
                            className="custom-label d-flex col-12"
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
                        {labourRate && !this.state.modalIsOpen ? (
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
                                selectedLabourRate.value !== ""
                                  ? true
                                  : false
                              }
                              value={selectedLabourRate}
                            />
                          </Col>
                        ) : null}
                        {pricingMatrix && !this.state.modalIsOpen ? (
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
            {/* {expandForm ? (
              <Col md="12 text-center pt-3">
                <span
                  onClick={this.handleExpandForm}
                  className="customer-anchor-text customer-click-btn"
                >
                  {" "}
                  Show Less{" "}
                </span>
              </Col>
            ) : null} */}
            {/* </>
            ) : (
                ""
              )} */}
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
              <Button color="primary" onClick={this.addNewCustomer}>
                {isCustVehiclemodal ? "Add Customer and Continue >" : "Add Customer"}
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
