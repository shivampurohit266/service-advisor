import React, { Component } from "react";
import * as classnames from "classnames";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Col,
  FormGroup,
  InputGroup,
  FormFeedback,
  Label,
  Input,
  CustomInput
} from "reactstrap";
// import { AppSwitch } from "@coreui/react";
import { AppConfig } from "../../config/AppConfig";
import { PhoneOptions, DefaultErrorMessage } from "../../config/Constants";
import MaskedInput from "react-text-mask";
import {
  CustomerDefaultPermissions,
  CustomerPermissionsText
} from "../../config/Constants";
import {
  CreateRateValidations,
  CreateRateValidMessaages
} from "../../validations";
// import Async from "react-select/lib/Async";
import { CrmStandardModel } from "../common/CrmStandardModel";
import { logger } from "../../helpers/Logger";
import Validator from "js-object-validation";
import { ApiHelper } from "../../helpers/ApiHelper";
import { toast } from "react-toastify";
import {
  CreateFleetValidations,
  CreateFleetValidMessaages
} from "../../validations";
import LastUpdated from "../common/LastUpdated";

export class CrmFleetEditModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      switchValue: true,
      companyName: "",
      phoneDetail: [
        {
          phone: "",
          value: ""
        }
      ],
      email: "",
      notes: "",
      address1: "",
      address2: "",
      city: "",
      state: "",
      zipCode: "",
      permission: "",
      fleetId: "",
      errors: {},
      phoneErrors: [""],
      isEditMode: false,
      phoneLength: AppConfig.phoneLength,
      fleetDefaultPermissions: CustomerDefaultPermissions,
      percentageDiscount: 0,
      defaultOptions: [{ value: "", label: "Add New Customer" }],
      vendorValue: "",
      selectedLabourRate: { value: "", label: "Select..." },
      selectedPriceMatrix: { value: "", label: "Type to select" },
      openStadardRateModel: false,
      percentageError: "",
      inCorrectNumber: []
    };
  }
  stdModelFun = () => {
    this.setState({
      openStadardRateModel: !this.state.openStadardRateModel
    });
  };
  handlePercentageChange = e => {
    if (isNaN(e.target.value)) {
      return
    }
    if (parseFloat(e.target.value) >= 100) {
      this.setState({
        percentageError: "Enter proper percentage value,less than 100"
      })
      return;
    } else {
      this.setState({
        percentageError: ""
      })
    }
    const { fleetDefaultPermissions } = this.state;
    fleetDefaultPermissions["shouldReceiveDiscount"].percentageDiscount =
      e.target.value;
    this.setState({
      ...fleetDefaultPermissions
    });
  };
  handleStandardRate = selectValue => {
    if (selectValue) {
      if (selectValue.value === "") {
        this.setState({
          openStadardRateModel: !this.state.openStadardRateModel
        });
      } else {
        const { fleetDefaultPermissions } = this.state;
        fleetDefaultPermissions["shouldLaborRateOverride"].laborRate =
          selectValue.value;
        this.setState({
          ...fleetDefaultPermissions,
          selectedLabourRate: selectValue
        });
        // this.props.setDefaultRate(selectValue);
      }
    } else {
      this.props.onTypeHeadStdFun({});
      this.setState({
        selectedLabourRate: { value: "", label: "Select..." }
      });
    }
  };
  handleRateAdd = async data => {
    const profileData = this.props.profileInfoReducer;
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
        }
      }
    } catch (error) {
      logger(error);
    }
  };
  componentDidUpdate({ fleetSingleData }) {
    if (fleetSingleData._id !== this.props.fleetSingleData._id) {
      const { fleetSingleData } = this.props;
      this.setState({
        address1: fleetSingleData.address1,
        city: fleetSingleData.city,
        companyName: fleetSingleData.companyName,
        email: fleetSingleData.email,
        notes: fleetSingleData.notes,
        fleetDefaultPermissions: fleetSingleData.fleetDefaultPermissions,
        state: fleetSingleData.state,
        zipCode: fleetSingleData.zipCode,
        phoneDetail:
          fleetSingleData.phoneDetail && fleetSingleData.phoneDetail.length
            ? fleetSingleData.phoneDetail
            : [
              {
                phone: "mobile",
                value: ""
              }
            ],
        fleetId: fleetSingleData._id,
        // errors: {},
        inCorrectNumber: []
      });
      if (
        fleetSingleData.fleetDefaultPermissions &&
        fleetSingleData.fleetDefaultPermissions.shouldPricingMatrixOverride
          .pricingMatrix !== null &&
        fleetSingleData.fleetDefaultPermissions.shouldPricingMatrixOverride
          .pricingMatrix !== "objectId"
      ) {
        const { matrixListReducerData } = this.props
        const pricingMatrixValue = fleetSingleData.fleetDefaultPermissions.shouldPricingMatrixOverride.pricingMatrix
        const selectedMatrix = matrixListReducerData.filter(matrix => matrix._id === pricingMatrixValue)
        if (selectedMatrix && selectedMatrix[0]) {
          this.setState({
            selectedPriceMatrix: {
              value: selectedMatrix[0]._id,
              label: selectedMatrix[0].matrixName
            }
          })
        }
      } else {
        this.setState({
          selectedPriceMatrix: {
            value: "",
            label: "Type to select"
          }
        })
      }
      if (
        fleetSingleData.fleetDefaultPermissions &&
        fleetSingleData.fleetDefaultPermissions.shouldLaborRateOverride
          .laborRate !== null &&
        fleetSingleData.fleetDefaultPermissions.shouldLaborRateOverride
          .laborRate !== "objectId"
      ) {
        this.handleGetRateData(
          fleetSingleData.fleetDefaultPermissions.shouldLaborRateOverride
            .laborRate
        );
      } else {
        this.setState({
          selectedLabourRate: {
            value: "",
            label: "Select..."
          }
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
  handleClick(singleState, e) {
    const { fleetDefaultPermissions } = this.state;
    fleetDefaultPermissions[singleState].status = e.target.checked;
    this.setState({
      ...fleetDefaultPermissions
    });
  }

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
  handleChange = event => {
    const { name, value } = event.target;
    if ((name === "phoneDetail" || name === "zipCode") && isNaN(value)) {
      return;
    } else {
      this.setState({
        [name]: value,
        errors: {
          ...this.state.errors,
          [name]: null
        }
      });
    }
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

  setStateAsync(state) {
    return new Promise(resolve => {
      this.setState(state, resolve);
    });
  }

  handleEditFleet = async (fleetData, fleetId) => {
    // this.setState({
    //   errors: {}
    // });
    try {
      const { phoneDetail } = this.state;
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
      let validationData;
      if (!fleetData.email) {
        validationData = {
          companyName: fleetData.companyName.trim()
        };
      } else {
        validationData = {
          companyName: fleetData.companyName.trim(),
          email: fleetData.email
        };
      }
      let { isValid, errors } = Validator(
        validationData,
        CreateFleetValidations,
        CreateFleetValidMessaages
      );
      let IncorrectNumber = [...this.state.inCorrectNumber], checkPhoneLength = true
      if (phoneDetail && phoneDetail.length) {
        for (let i = 0; i < phoneDetail.length; i++) {
          const phoneTrimed = (phoneDetail[i].value.replace(/[- )(_]/g, ""))
          if (phoneTrimed.length <= 9) {
            IncorrectNumber[i] = true
            this.setState({
              inCorrectNumber: IncorrectNumber
            });
            checkPhoneLength = false;
          }
        }
      }
      if (
        (!isValid && fleetData.email !== "") ||
        Object.keys(this.state.phoneErrors).length ||
        fleetData.companyName.trim() === "" || this.state.percentageError || !checkPhoneLength
      ) {
        this.setState({
          errors,
          isLoading: false
        });
        return;
      }
      const userData = this.props.profileInfoReducer;
      const userId = userData._id;
      const parentId = userData.parentId;
      const data = {
        fleetData: fleetData,
        userId: userId,
        parentId: parentId,
        fleetId: fleetId
      };
      this.props.updateFleet(data);
    } catch (error) {
      logger(error);
    }
  };

  matrixLoadOptions = (input, callback) => {
    this.props.getPriceMatrix({ input, callback });
  }

  handlePriceMatrix = (e) => {
    if (e && e.value) {
      const { fleetDefaultPermissions } = this.state;
      fleetDefaultPermissions["shouldPricingMatrixOverride"].pricingMatrix =
        e.value;
      this.setState({
        ...fleetDefaultPermissions,
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
      fleetEditModalOpen,
      handleFleetModal,
      // rateStandardListData,
      fleetSingleData
    } = this.props;
    const {
      companyName,
      phoneDetail,
      email,
      notes,
      address1,
      address2,
      city,
      state,
      zipCode,
      errors,
      percentageDiscount,
      // selectedLabourRate,
      fleetId,
      // selectedPriceMatrix,
      percentageError
    } = this.state;
    const phoneOptions = PhoneOptions.map((item, index) => {
      return (<React.Fragment key={index}><option value={item.key} key={index}>{item.text}</option></React.Fragment>);
    });

    let fleetDefaultPermissions = this.state.fleetDefaultPermissions;

    if (!fleetDefaultPermissions) {
      fleetDefaultPermissions = {};
      for (const key in CustomerDefaultPermissions) {
        if (CustomerDefaultPermissions.hasOwnProperty(key)) {
          const element = CustomerDefaultPermissions[key];
          fleetDefaultPermissions[key] = element;
        }
      }
    }
    const fleetData = {
      companyName,
      phoneDetail,
      email,
      notes,
      address1,
      address2,
      city,
      state,
      zipCode,
      fleetDefaultPermissions,
      percentageDiscount
    };
    
    return (
      <>
        <Modal
          isOpen={fleetEditModalOpen}
          toggle={handleFleetModal}
          backdrop={"static"}
          className="customer-modal custom-form-modal custom-modal-lg"
        >
          <ModalHeader toggle={handleFleetModal}>
            Update Fleet Details
            {fleetSingleData && fleetSingleData.updatedAt?
            <LastUpdated updatedAt={fleetSingleData.updatedAt} />
            :null}
          </ModalHeader>
          <ModalBody>
            <div className="">
              <Row className="justify-content-center">
                <Col md="6">
                  <FormGroup>
                    <Label htmlFor="name" className="customer-modal-text-style">
                      Company Name <span className={"asteric"}>*</span>
                    </Label>
                    <div className={"input-block"}>
                      <Input
                        type="text"
                        name="companyName"
                        onChange={this.handleChange}
                        placeholder="Company Name"
                        value={companyName}
                        maxLength="50"
                        id="name"
                        invalid={errors.companyName}
                      />
                      <FormFeedback>
                        {errors && errors.companyName 
                          ? "Company name is required"
                          : null}
                      </FormFeedback>
                    </div>
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <Label htmlFor="name" className="customer-modal-text-style">
                      Email
                    </Label>
                    <div className={"input-block"}>
                      <Input
                        type="text"
                        className="customer-modal-text-style"
                        placeholder="john.doe@example.com"
                        onChange={this.handleChange}
                        maxLength="40"
                        name="email"
                        value={email}
                        invalid={errors && errors.email && email}
                      />
                      <FormFeedback>
                        {errors && errors.email && email
                          ? "Please enter valid email address"
                          : null}
                      </FormFeedback>
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
                                {/* <div></div> */}

                                <Input
                                  onChange={e =>
                                    this.handlePhoneNameChange(index, e)
                                  }
                                  value={item.phone}
                                  type="select"
                                  id="name"
                                >
                                  {phoneOptions}
                                </Input>
                                {phoneDetail[index].phone === "mobile" ||
                                  phoneDetail[index].phone === "" ? (
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
                                          this.state.inCorrectNumber[index] && !(this.state.phoneErrors[index]) ? "Phone number should not be less than ten digit." : null
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
                                          this.state.inCorrectNumber[index] && !(this.state.phoneErrors[index]) ? "Phone number should not be less than ten digit." : null
                                        }
                                      </FormFeedback>
                                    </div>
                                  )}
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
                                    value={item.phone}
                                    type="select"
                                    id="name"
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
                                          this.state.inCorrectNumber[index] && !(this.state.phoneErrors[index]) ? "Phone number should not be less than ten digit." : null
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
                                            this.state.inCorrectNumber[index] && !(this.state.phoneErrors[index]) ? "Phone number should not be less than ten digit." : null
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

                {phoneDetail.length < 2 ? (
                  <Col md="6">
                    <FormGroup className="mb-0 phone-info-block">
                      <p className={"phone-info-text mb-0"}>
                        You can add more phone number related to your office ,
                        home etc.
                      </p>
                    </FormGroup>
                  </Col>
                ) : null}

                {phoneDetail && phoneDetail.length < 3 ? (
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
            </div>
            <div>
              <Row className="custom-label-padding ">
                {CustomerPermissionsText
                  ? CustomerPermissionsText.map((permission, index) => {
                    let discountShow = false;
                    if (
                      permission.key === "shouldReceiveDiscount" &&
                      fleetDefaultPermissions[permission.key].status
                    ) {
                      discountShow = true;
                    }
                    return (
                      <>
                        <Col
                          md="6"
                          htmlFor={`fleet-permision-${index}`}
                          key={index}
                          className={
                            permission.key === "shouldPricingMatrixOverride"
                              ? "price-matrix"
                              : null
                          }
                        >
                          <div className="d-flex">
                            <CustomInput
                              className={"mx-1"}
                              type={"checkbox"}
                              checked={
                                fleetDefaultPermissions[permission.key].status
                              }
                              id={`fleet-permision-${index}`}
                              onChange={this.handleClick.bind(
                                this,
                                permission.key
                              )}
                            />
                            <p className="customer-modal-text-style">
                              {permission.text}
                            </p>
                          </div>
                          {discountShow ? (
                            <div className="custom-label col-12 d-flex" key={index}>
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
                                        invalid={fleetDefaultPermissions[permission.key]
                                          .percentageDiscount && percentageError ? true : false}
                                        value={
                                          fleetDefaultPermissions[permission.key]
                                            .percentageDiscount
                                        }
                                      />

                                      <div className="input-group-append">
                                        <span className="input-group-text">
                                          <i className="fa fa-percent"></i>
                                        </span>
                                      </div>
                                    </InputGroup>
                                    <p className="text-danger text-nowrap">
                                      {fleetDefaultPermissions[permission.key]
                                        .percentageDiscount && percentageError
                                        ? percentageError
                                        : null}
                                    </p>
                                  </div>
                                </Col>
                              </FormGroup>
                            </div>
                          ) : null}
                        </Col>
                      </>
                    );
                  })
                  : null}
              </Row>
            </div>
            <div className="">
              <Row className="justify-content-center">
                <Col md="6">
                  <FormGroup>
                    <Label htmlFor="name" className="customer-modal-text-style">
                      Address
                    </Label>
                    <Input
                      type="text"
                      placeholder="Address"
                      id="name"
                      value={address1}
                      maxLength="200"
                      onChange={this.handleChange}
                      name="address1"
                    />
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <Label htmlFor="name" className="customer-modal-text-style">
                      City
                    </Label>
                    <Input
                      type="text"
                      id="name"
                      name="city"
                      value={city}
                      maxLength="100"
                      onChange={this.handleChange}
                      placeholder="New York"
                    />
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <Label htmlFor="name" className="customer-modal-text-style">
                      State
                    </Label>
                    <Input
                      type="text"
                      name="state"
                      value={state}
                      onChange={this.handleChange}
                      id="name"
                      maxLength="100"
                      placeholder="NY"
                    />
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <Label
                      htmlFor="name"
                      name="zip"
                      className="customer-modal-text-style"
                    >
                      Zip Code
                    </Label>
                    <Input
                      type="text"
                      id="name"
                      name="zipCode"
                      value={zipCode}
                      maxLength="5"
                      onChange={this.handleChange}
                      placeholder="Zip Code"
                    />
                  </FormGroup>
                </Col>
              </Row>
            </div>
            <div className="">
              <Row className="justify-content-center">
                <Col md="12">
                  <FormGroup>
                    <Label htmlFor="name" className="customer-modal-text-style">
                      Notes
                    </Label>
                    <Input
                      type="textarea"
                      placeholder="Enter a note..."
                      id="name"
                      value={notes}
                      maxLength={"1000"}
                      onChange={this.handleChange}
                      name="notes"
                    />
                  </FormGroup>
                </Col>
              </Row>
            </div>
            <CrmStandardModel
              openStadardRateModel={this.state.openStadardRateModel}
              stdModelFun={this.stdModelFun}
              errors={errors}
              handleRateAdd={this.handleRateAdd}
            />
          </ModalBody>
          <ModalFooter>
            <div className="required-fields">*Fields are Required.</div>
            <Button
              color="primary"
              onClick={() => this.handleEditFleet(fleetData, fleetId)}
            >
              {"Update Fleet Details"}
            </Button>{" "}
            <Button color="secondary" onClick={handleFleetModal}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </>
    );
  }
}
