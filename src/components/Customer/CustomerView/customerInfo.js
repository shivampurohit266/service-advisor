import React, { Component } from "react";
import * as classnames from "classnames";
// import MaskedInput from "react-maskedinput";
import {
  Row,
  Col,
  FormGroup,
  // InputGroup,
  Label,
  Input,
  Button
} from "reactstrap";
// import { AppSwitch } from "@coreui/react";
import {
  CustomerDefaultPermissions,
  // CustomerPermissionsText
} from "../../../config/Constants";
import { AppConfig } from "../../../config/AppConfig";
import { CrmEditCustomerModal } from "../../common/CrmEditCustomerModal";

export class CustomerInfo extends Component {
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
      selectedPriceMatrix: { value: "", label: "Type to select" },
      selectedLabourRate: { value: "", label: "Select..." },
      percentageError: "",
      inCorrectNumber: [],
      customerId: ""
    };
  }
  componentDidMount = () => {
    this.props.customerGetRequest({ customerId: this.props.match.params.id })
    this.props.getMatrix();
    this.props.getStdList("");
    this.props.setLabourRateDefault();
    this.props.getCustomerFleetListActions();
  }
  componentDidUpdate(prevProps) {
    if (
      this.props.customerDetails &&
      (prevProps.customerDetails !== this.props.customerDetails)
    ) {
      const { customerDetails } = this.props;
      this.setState({
        customerId: customerDetails._id,
        address1: customerDetails.address1,
        city: customerDetails.city,
        companyName: customerDetails.companyName,
        email: customerDetails.email,
        firstName: customerDetails.firstName,
        lastName: customerDetails.lastName,
        notes: customerDetails.notes,
        customerDefaultPermissions: customerDetails.permission,
        referralSource: customerDetails.referralSource,
        state: customerDetails.state,
        zipCode: customerDetails.zipCode,
        phoneDetail:
          customerDetails.phoneDetail && customerDetails.phoneDetail.length
            ? customerDetails.phoneDetail
            : [
              {
                phone: "mobile",
                value: ""
              }
            ],
        inCorrectNumber: []
      });
      if (
        this.props.customerDetails.customerDefaultPermissions &&
        this.props.customerDetails.customerDefaultPermissions.shouldPricingMatrixOverride
          .pricingMatrix !== null &&
        this.props.customerDetails.customerDefaultPermissions.shouldPricingMatrixOverride
          .pricingMatrix !== "objectId"
      ) {
        const { matrixListReducerData, customerDetails } = this.props
        const pricingMatrixValue = customerDetails.customerDefaultPermissions.shouldPricingMatrixOverride.pricingMatrix
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
      if (customerDetails.fleet && customerDetails.fleet._id) {
        this.setState({
          selectedOption: {
            value: customerDetails.fleet._id,
            label: customerDetails.fleet.companyName
          },
          fleet: customerDetails.fleet._id
        });
      } else {
        this.setState({
          selectedOption: {
            value: "",
            label: "Select..."
          }
        });
      }
    }
  }
  toggleEditModal = () => {
    const { modelOperate, modelInfoReducer } = this.props
    const { modelDetails } = modelInfoReducer;
    let data = {
      customerModel: false,
      customerEditModel: !modelDetails.customerEditModel
    };
    modelOperate(data)
  }
  updateCustomerForm = data => {
    let customerId = this.state.customerId;
    data.customerId = customerId;
    data.isSingleCustomer = true
    this.props.updateCustomer({ data: data });
  };
  onTypeHeadStdFun = data => {
    this.props.getStdList(data);
  };
  onStdAdd = () => {
    this.props.getStdList();
  };
  setDefaultRate = value => {
    this.props.setLabourRateDefault(value);
  };
  loadTypeRate = input => {
    this.props.getStdList(input);
  };
  render() {
    const {
      modelInfoReducer,
      matrixListReducer,
      rateStandardListReducer,
      customerDetails,
      getMatrix,
      customerFleetReducer,
      profileInfoReducer
    } = this.props
    const { modelDetails } = modelInfoReducer
    const { customerEditModel } = modelDetails
    const {
      selectedOption,
      phoneDetail,
      firstName,
      // selectedLabourRate,
      // selectedPriceMatrix,
      // percentageError
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
    return (
      <div className="custom-form-modal pl-4 pr-4 pt-4">
        <div>
          <Row className="justify-content-center ">
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
                    disabled
                    value={firstName}
                    maxLength="30"
                  />
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
                    disabled
                    name="lastName"
                    value={this.state.lastName}
                    maxLength="30"
                  />
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
                              disabled
                              type="select"
                              id="name"
                              value={item.phone}
                            >
                              <option value={item.phone}>{item.phone}</option>
                            </Input>
                            {phoneDetail[index].phone === "mobile" ? (
                              <div className="input-block select-number-tile">
                                <Input
                                  name="phoneDetail"
                                  placeholder="(555) 055-0555"
                                  className={classnames("form-control", {
                                    "is-invalid":
                                      (this.state.phoneErrors[index] !== "" &&
                                        !item.value) || (this.state.inCorrectNumber[index])
                                  })}
                                  maxLength={"10"}
                                  value={item.value}
                                  disabled
                                />
                              </div>
                            ) : (
                                <div className="input-block select-number-tile">
                                  <Input
                                    name="phoneDetail"
                                    className={classnames("form-control", {
                                      "is-invalid":
                                        (this.state.phoneErrors[index] !== "" &&
                                          !item.value) || (this.state.inCorrectNumber[index])
                                    })}
                                    placeholder="(555) 055-0555 ext 1234"
                                    maxLength={"10"}
                                    value={item.value}
                                    disabled
                                  />
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
                                disabled
                                name="email"
                                value={this.state.email}
                                maxLength="100"
                              />
                            </div>
                          </FormGroup>
                        </Col>
                      </>
                    ) : (
                        <>
                          <Col md="6">
                            <FormGroup className="phone-number-feild">
                              <Label
                                htmlFor="name"
                                className="customer-modal-text-style"
                              >
                                Phone
                              </Label>
                              {/* <div></div> */}
                              <Input
                                type="select"
                                id="name"
                                required
                                disabled
                                value={item.phone}
                              >
                              </Input>
                              {phoneDetail[index].phone === "mobile" ? (
                                <div className="input-block select-number-tile">
                                  <Input
                                    name="phoneDetail"
                                    placeholder="(555) 055-0555"
                                    className={classnames("form-control", {
                                      "is-invalid":
                                        (this.state.phoneErrors[index] !== "" &&
                                          !item.value) || (this.state.inCorrectNumber[index])
                                    })}
                                    maxLength={"10"}
                                    value={item.value}
                                    disabled
                                  />
                                </div>
                              ) : (
                                  <div className="input-block select-number-tile">
                                    <Input
                                      name="phoneDetail"
                                      className={classnames("form-control", {
                                        "is-invalid":
                                          (this.state.phoneErrors[index] !== "" &&
                                            !item.value) || (this.state.inCorrectNumber[index])
                                      })}
                                      placeholder="(555) 055-0555 ext 1234"
                                      maxLength={"15"}
                                      value={item.value}
                                      disabled
                                    />
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
                  disabled
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
                <Input
                  disabled
                  value={selectedOption.label}
                  className={"w-100 form-select"}
                  //classNamePrefix={"form-select-theme"}
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
                  Address
                </Label>
                <Input
                  type="text"
                  placeholder="Address"
                  name="address1"
                  value={this.state.address1}
                  disabled
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
                  disabled
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
                  disabled
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
                  disabled
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
                <Input
                  type="text"
                  placeholder="Referral"
                  disabled
                  name="referralSource"
                  value={this.state.referralSource}
                  maxLength="100"
                />
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
                        variant={"3d"}
                        color={"primary"}
                        disabled
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
                                  className="form-control"
                                  value={
                                    customerDefaultPermissions[
                                      permission.key
                                    ].percentageDiscount
                                  }
                                  disabled
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
                        <Input
                          value={selectedLabourRate}
                          disabled
                        />
                      </Col>
                    ) : null}
                    {pricingMatrix ? (
                      <Col
                        md=""
                        className={"fleet-block rate-standard-list"}
                      >
                        <Input
                          placeholder={"Type to select price matrix"}
                          value={selectedPriceMatrix}
                          disabled
                        />
                      </Col>
                    ) : null}
                  </Col>
                </React.Fragment>
              );
            })
            : null}
        </Row> */}
        <div className={"text-center"}>
          <Button onClick={this.toggleEditModal} color={""} className={"btn-theme"}>Edit Customer Details</Button>
        </div>
        {
          customerDetails && Object.entries(customerDetails) ?
            <CrmEditCustomerModal
              customerModalOpen={customerEditModel}
              handleCustomerModalFun={this.toggleEditModal}
              addCustomerFun={this.updateCustomerForm}
              profileInfo={profileInfoReducer}
              matrixListReducerData={matrixListReducer.matrixList}
              rateStandardListData={rateStandardListReducer}
              onTypeHeadStdFun={this.onTypeHeadStdFun}
              onStdAdd={this.onStdAdd}
              editMode={true}
              customer={customerDetails}
              getPriceMatrix={getMatrix}
              getCustomerFleetList={customerFleetReducer.customerFleetData}
              setDefaultRate={this.setDefaultRate}
              loadTypeRate={this.loadTypeRate}
            /> :
            null
        }
      </div>
    );
  }
}
