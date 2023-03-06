import React, { Component } from "react";
import MaskedInput from "react-maskedinput";
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
  Label,
  Input,
  Form,
  FormFeedback,
  InputGroup
} from "reactstrap";
import { AppSwitch } from "@coreui/react";
import { logger } from "../../helpers/Logger";
import Validator from "js-object-validation";
import {
  CreateUserValidations,
  CreateUserValidationsMessaages
} from "../../validations";
import {
  AdminDefaultPermissions,
  TechincianDefaultPermissions,
  UserPermissions,
  RoleOptions
} from "../../config/Constants";
import LastUpdated from "../common/LastUpdated";
import { AppRoutes } from "../../config/AppRoutes";
import DatePicker from 'react-date-picker';

export class CrmUserModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      roleType: "5ca3473d70537232f13ff1fa",
      rate: "",
      companyName: "",
      permissions: TechincianDefaultPermissions,
      dob: "",
      anniversary: "",
      errors: {},
      isEditMode: false,
      phoneError: false
    };
  }
  componentDidMount = () => {
    this.setState({
      companyName: this.props.companyName
    })
  }
  componentDidUpdate({ userModalOpen, userData }) {

    if (
      this.props.userModalOpen !== userModalOpen &&
      !this.props.userModalOpen
    ) {
      this.setState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        roleType: "5ca3473d70537232f13ff1fa",
        rate: "",
        permissions: TechincianDefaultPermissions,
        dob: "",
        anniversary: "",
        errors: {}
      });
    }
    else if (
      this.props.userData &&
      this.props.userData._id &&
      (userData._id !== this.props.userData._id || !this.state.email) && this.props.userModalOpen
    ) {
      const {
        firstName,
        lastName,
        email,
        phone,
        companyName,
        rate,
        permissions,
        dob,
        anniversary,
      } = this.props.userData;

      this.setState({
        isEditMode: true,
        firstName,
        lastName,
        email,
        companyName,
        phone: phone || "",
        roleType: this.props.userData.roleType ? this.props.userData.roleType._id || this.props.userData.roleType : "5ca3473d70537232f13ff1fa",
        rate: rate || "",
        permissions,
        dob,
        anniversary,
      });

    }

  }
  handleClick = e => {
    this.setState({
      permissions: {
        ...this.state.permissions,
        [e.target.name]: e.target.checked
      }
    });
  };
  handleInputChange = e => {
    const { target } = e;
    const { name, value } = target;
    if (name === "rate" && isNaN(value)) {
      return
    }
    this.setState({
      [name]: name === "firstName" || name === "lastName" ? value.charAt(0).toUpperCase() +
        value.substring(1) : value,
      errors: {
        ...this.state.errors,
        [name]: null
      }
    });
    if (name === "roleType") {
      switch (value) {
        case RoleOptions[0].key:
          this.setState({
            permissions: AdminDefaultPermissions
          });
          break;
        case RoleOptions[1].key:
          this.setState({
            permissions: TechincianDefaultPermissions
          });
          break;
        default:
          this.setState({
            permissions: {}
          });
          break;
      }
    }
  };
  addUser = e => {
    e.preventDefault();
    try {
      const {
        firstName,
        lastName,
        email,
        phone,
        rate,
        permissions,
        companyName,
        isEditMode,
        dob,
        anniversary,
      } = this.state;
      // const companyName = this.props.companyName
      const payload = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone,
        roleType: "5ca3473d70537232f13ff1fa",
        companyName,
        rate: rate
          ? parseFloat(rate.toString().replace(/[$,\s]/g, "")).toFixed(2)
          : "0",
        permissions,
        dob,
        anniversary,
      };
      const { isValid, errors } = Validator(
        payload,
        CreateUserValidations,
        CreateUserValidationsMessaages
      );
      let phError = false
      const phoneTrimed = (phone.replace(/[- )(_]/g, ""))
      const phoneLength = phoneTrimed.length <= 9
      if (phone && phoneLength) {
        this.setState({
          phoneError: true
        })
        phError = true
      } else {
        this.setState({
          phoneError: false
        })
        phError = false
      }
      if (!isValid || (phError)) {
        this.setState({
          errors
        });
        return;
      }
      if (!isEditMode) {
        this.props.addUser(payload);
      } else {
        this.props.updateUser(this.props.userData._id, payload);
      }
    } catch (error) {
      logger(error);
    }
  };
  onChangeAnniversary = date => {
    this.setState({
      anniversary: date
    })
  }
  onChangeDob = date => {
    console.log("date", date);

    this.setState({
      dob: date
    })
  }
  /**
   * 
   */
  render() {
    const { userModalOpen, handleUserModal, userData } = this.props;
    const {
      permissions,
      firstName,
      lastName,
      email,
      phone,
      rate,
      roleType,
      errors,
      isEditMode,
      phoneError,
      dob,
      anniversary,
    } = this.state;
    return (
      <>
        <Form onSubmit={this.addUser}>
          <Modal
            isOpen={userModalOpen}
            toggle={handleUserModal}
            className="customer-modal custom-form-modal custom-modal-lg"
          >
            <ModalHeader toggle={handleUserModal}>
              {!isEditMode ? `Add New ${AppRoutes.STAFF_MEMBERS.name}` : `Update ${AppRoutes.STAFF_MEMBERS.name} details`}
              {isEditMode ? <>
                {userData && userData.updatedAt ?
                  <LastUpdated updatedAt={userData.updatedAt} />
                  : null}
              </> : null}
            </ModalHeader>
            <ModalBody>
              <Row className="justify-content-center">
                <Col md="6">
                  <FormGroup>
                    <InputGroup>
                      <Label
                        htmlFor="name"
                        className="customer-modal-text-style"
                      >
                        First Name <span className={"asteric"}>*</span>
                      </Label>
                      <div className={"input-block"}>
                        <Input
                          type="text"
                          placeholder="John"
                          onChange={this.handleInputChange}
                          value={firstName}
                          name="firstName"
                          invalid={errors.firstName ? true : false}
                        />
                        <FormFeedback>
                          {errors.firstName ? errors.firstName : null}
                        </FormFeedback>
                      </div>
                    </InputGroup>
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <InputGroup>
                      <Label
                        htmlFor="name"
                        className="customer-modal-text-style"
                      >
                        Last Name <span className={"asteric"}>*</span>
                      </Label>
                      <div className={"input-block"}>
                        <Input
                          type="text"
                          placeholder="Doe"
                          onChange={this.handleInputChange}
                          value={lastName}
                          name="lastName"
                          invalid={errors.lastName ? true : false}
                        />
                        <FormFeedback>
                          {errors.lastName ? errors.lastName : null}
                        </FormFeedback>
                      </div>
                    </InputGroup>
                  </FormGroup>
                </Col>
              </Row>
              <Row className="justify-content-center">
                <Col md="6">
                  <FormGroup>
                    <Label htmlFor="name" className="customer-modal-text-style">
                      Email <span className={"asteric"}>*</span>
                    </Label>
                    <div className={"input-block"}>
                      <Input
                        type="text"
                        placeholder="john.doe@example.com"
                        onChange={this.handleInputChange}
                        value={email}
                        name="email"
                        disabled={isEditMode}
                        invalid={errors.email ? true : false}
                      />
                      <FormFeedback>
                        {errors.email ? errors.email : null}
                      </FormFeedback>
                    </div>
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <Label htmlFor="name" className="customer-modal-text-style">
                      Phone
                    </Label>
                    <div className={"input-block"}>
                      <MaskedInput
                        mask="(111) 111-1111"
                        name="phone"
                        placeholder="(555) 055-0555"
                        className={classnames("form-control", {
                          "is-invalid": phoneError && phone
                        })}
                        size="20"
                        value={phone}
                        onChange={this.handleInputChange}
                      />

                      <FormFeedback>
                        {errors.phone ? errors.phone : null}
                        {phoneError && phone ? "Enter proper 10 dight phone number" : null}
                      </FormFeedback>
                    </div>
                  </FormGroup>
                </Col>
              </Row>
              <Row className="justify-content-center">
                <Col md="6">
                  <FormGroup>
                    <Label htmlFor="name" className="customer-modal-text-style">
                      Type
                    </Label>
                    <div className={"input-block"}>
                      <Input
                        type="text"
                        className="customer-modal-text-style"
                        id="type"
                        disabled
                        // onChange={this.handleInputChange}
                        value={roleType === "5ca3473d70537232f13ff1fa" ? "Technician" : "Admin"}
                        name="roleType"
                        invalid={errors.roleType}
                      >
                        {/* {RoleOptions.map((role, index) => {
                          return (
                            <option value={role.key} key={index}>
                              {role.text}
                            </option>
                          );
                        })} */}
                      </Input>
                      <FormFeedback>
                        {errors.roleType ? errors.roleType : null}
                      </FormFeedback>
                    </div>
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <Label htmlFor="name" className="customer-modal-text-style">
                      Rate/hour
                    </Label>
                    <div className={"input-block"}>
                      <InputGroup>
                        <div className="input-group-prepend">
                          <span className="input-group-text">
                            <i className="fa fa-dollar"></i>
                          </span>
                        </div>
                        <Input
                          value={rate}
                          name={"rate"}
                          placeholder={"0.00"}
                          onChange={this.handleInputChange}
                          className={classnames("form-control", {
                            "is-invalid": errors.rate
                          })}
                        />
                      </InputGroup>
                      <FormFeedback>
                        {errors.rate ? errors.rate : null}
                      </FormFeedback>
                    </div>
                  </FormGroup>
                </Col>
              </Row>
              <Row className="justify-content-center">
                <Col md="6">
                  <FormGroup>
                    <Label htmlFor="name" className="customer-modal-text-style">
                      DOB
                    </Label>
                    <div className={"input-block"}>
                      <DatePicker
                        name="dob"
                        calendarType={"US"}
                        format={"dd/MM/y"}
                        defaultActiveStartDate={new Date()}
                        onChange={this.onChangeDob}
                        value={dob ? new Date(dob) : ""}
                        clearIcon={dob ? <i className="fa fa-times" aria-hidden="true" />
                          : null}
                        maxDate={new Date()}
                      />
                    </div>
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <Label htmlFor="name" className="customer-modal-text-style">
                      Anniversary
                    </Label>
                    <div className={"input-block"}>
                      <DatePicker
                        name="anniversary"
                        calendarType={"US"}
                        format={"dd/MM/y"}
                        defaultActiveStartDate={new Date()}
                        onChange={this.onChangeAnniversary}
                        value={anniversary ? new Date(anniversary) : ""}
                        clearIcon={anniversary ? <i className="fa fa-times" aria-hidden="true" />
                          : null}
                      />
                    </div>
                  </FormGroup>
                </Col>
              </Row>
              <Row className={"custom-label-padding "}>
                {roleType
                  ? UserPermissions.map((permission, index) => {
                    return (
                      <Col sm={"6"} key={index}>
                        <Row
                          className="justify-content-center pb-2"
                          key={index}
                        >
                          <Col md="2">
                            <AppSwitch
                              className={"mx-1"}
                              name={permission.key}
                              checked={permissions[permission.key]}
                              onClick={this.handleClick}
                              variant={"3d"}
                              color={"primary"}
                              size={"sm"}
                            />
                          </Col>
                          <Col md="10">
                            <p className="customer-modal-text-style">
                              {permission.text}
                            </p>
                          </Col>
                        </Row>
                      </Col>
                    );
                  })
                  : null}
              </Row>
            </ModalBody>
            <ModalFooter>
              <div className="required-fields">*Fields are Required.</div>
              <Button color="primary" onClick={this.addUser}>
                {isEditMode ? "Update" : "Add"} {AppRoutes.STAFF_MEMBERS.name}
              </Button>{" "}
              <Button color="secondary" onClick={handleUserModal}>
                Cancel
              </Button>
            </ModalFooter>
          </Modal>
        </Form>
      </>
    );
  }
}
