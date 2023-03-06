import Validator from "js-object-validation";
import React, { Component } from "react";

import {
  Button,
  Card,
  CardBody,
  CardGroup,
  Col,
  // Form,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row,
  FormGroup,
  FormFeedback,
  UncontrolledPopover,
  PopoverHeader,
  PopoverBody
} from "reactstrap";

import { logger } from "../helpers/Logger";
import { SingupValidations, SingupValidationsMessaages } from "../validations";
import MailIcon from "./../assets/img/mail-icon.svg";
import { Link } from "react-router-dom";
import { isValidURL, isValidSubdomain } from "../helpers/Object";
import ServiceAdvisorLogo from "../assets/logo-white.svg";

const ResendInvitation = props => {
  return (
    <div className={"confirm-block"}>
      <h1 className={"text-center"}>Confirmation Link Sent</h1>
      <div className={"pt-2 pb-2 pr-2 text-center icon-block"}>
        <img
          src={MailIcon}
          alt={"email-icon"}
          style={{ width: 150, height: 150 }}
        />
      </div>
      <h4 className={"text-center"}>Thank you for Signing Up!</h4>
      <p className="confirm-text">
        A Confirmation email has been sent to your Email address.
        <br /> Kindly verify your account to Login.
      </p>
      <div className="text-center">
        <Button
          color="primary"
          className={"px-4 btn-theme"}
          onClick={props.resendConfimationLink}
        >
          Resend Link
        </Button>
      </div>
    </div>
  );
};

class RegisterPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      companyName: "",
      workspace: "",
      companyWebsite: "",
      companyLogo: "",
      errors: {},
      isLoading: false,
      showResendPage: false,
    };
  }
  componentDidMount() {
    localStorage.removeItem("userId");
  }
  componentDidUpdate() {
    const userId = localStorage.getItem("userId");
    const { showResendPage } = this.state;
    if (userId && !showResendPage) {
      this.setState({
        showResendPage: true
      });
    }
  }
  eventHandler = e => {
    this.setState({
      [e.target.name]:
        e.target.name === "workspace"
          ? e.target.value.toLowerCase()
          : e.target.name === "firstName" || e.target.name === "lastName" ? e.target.value.charAt(0).toUpperCase() +
            e.target.value.substring(1) : e.target.value,
      errors: { ...this.state.errors, [e.target.name]: null }
    });
  };
  handleSubmit = e => {
    e.preventDefault();
    this.setState({
      errors: {}
    });
    try {
      const {
        firstName,
        lastName,
        email,
        password,
        companyLogo,
        companyName,
        companyWebsite,
        workspace,
        confirmPassword
      } = this.state;
      const d = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        password: password.trim(),
        companyLogo,
        companyName: companyName.trim(),
        companyWebsite: companyWebsite.trim(),
        workspace: workspace.trim(),
        confirmPassword: confirmPassword.trim()
      };
      let { isValid, errors } = Validator(
        d,
        SingupValidations,
        SingupValidationsMessaages
      );
      if (d.companyWebsite && !isValidURL(d.companyWebsite)) {
        errors.companyWebsite = "Please enter a valid URL. Include http:// or https://";
        isValid = false;
      }
      if (d.workspace && !isValidSubdomain(d.workspace)) {
        errors.workspace = "Workspace can only have a-z, 0-9 and -";
        isValid = false;
      }
      if (d.password && !errors.password) {
        let res = (d.password).match(/^(?=.*\d)(?=.*[a-zA-Z])[\w~@#$%^&*+=`|{}:;!.?()\]-]{6,20}$/);
        if (!res) {
          isValid = false;
          errors.password = "Password must have alphanumeric characters with optional (special characters)."
        }
      }
      if (!isValid) {
        this.setState({
          errors,
          isLoading: false
        });
        return;
      }

      this.props.onSignup(d);
    } catch (error) {
      logger(error);
    }
  };
  resendConfimationLink = e => {
    e.preventDefault();
    logger(localStorage.getItem("userId"));
    this.props.onResendLink({
      id: localStorage.getItem("userId")
    });
  };
  onBlur = () => {
    if (this.state.workspace === "") {
      let errors = { ...this.state.errors }
      errors.workspace = null;
      this.setState({
        workspace: (this.state.companyName).replace(/\s/g, '').replace(/[^\w\s]/gi, '-').toLowerCase(),
        errors
      })
    }
  }
  render() {
    // const { settingData } = this.props
    const {
      errors,
      email,
      firstName,
      lastName,
      password,
      confirmPassword,
      showResendPage,
      companyName,
      workspace,
      companyWebsite
    } = this.state;
    return (
      <>
        <div className="app app1 flex-row align-items-center auth-page pt-3 pb-3">
          <div className="auth-bg" />
          <Row className="justify-content-center m-0">
            <Col md="12" lg="12" xl="12">
              <Col className="text-center">
                <h4 className="logo-title">
                  <Link to="/home" target="_blank">
                    <img
                      src={ServiceAdvisorLogo}
                      alt={"logo"}
                      style={{ width: 120 }}
                    />
                  </Link>
                </h4>
              </Col>
              <CardGroup>
                <Card className="p-4 pl-4 pr-4 card">
                  <CardBody className="pl-4 pr-4 pt-0 pb-0">
                    {!showResendPage ? (
                      <>
                        {/* <Form onSubmit={this.handleSubmit}> */}
                        <h1 className="auth-title">Sign Up</h1>
                        <p className="text-muted text-center text-info-line">
                          To Create Your Workspace
                        </p>
                        <FormGroup className={"auth-input-group"}>
                          <InputGroup className="mb-3">
                            <InputGroupAddon
                              addonType="prepend"
                              className={errors.firstName ? "invalid" : " "}
                            >
                              <InputGroupText>
                                <i className="icon-user" />
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input
                              type="text"
                              placeholder="First Name"
                              autoComplete="first-name"
                              onChange={this.eventHandler}
                              value={firstName}
                              name="firstName"
                              invalid={errors.firstName ? true : false}
                            />
                            <FormFeedback>
                              {errors.firstName ? errors.firstName : null}
                            </FormFeedback>
                          </InputGroup>
                        </FormGroup>
                        <FormGroup className={"auth-input-group"}>
                          <InputGroup className="mb-3">
                            <InputGroupAddon
                              addonType="prepend"
                              className={errors.lastName ? "invalid" : " "}
                            >
                              <InputGroupText>
                                <i className="icon-user" />
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input
                              type="text"
                              placeholder="Last Name"
                              autoComplete="last-name"
                              onChange={this.eventHandler}
                              value={lastName}
                              name="lastName"
                              invalid={errors.lastName ? true : false}
                            />
                            <FormFeedback>
                              {errors.lastName ? errors.lastName : null}
                            </FormFeedback>
                          </InputGroup>
                        </FormGroup>
                        <FormGroup className={"auth-input-group"}>
                          <InputGroup className="mb-3">
                            <InputGroupAddon
                              addonType="prepend"
                              className={errors.email ? "invalid" : " "}
                            >
                              <InputGroupText>@</InputGroupText>
                            </InputGroupAddon>
                            <Input
                              type="text"
                              placeholder="Email"
                              autoComplete="email"
                              onChange={this.eventHandler}
                              value={email}
                              name="email"
                              invalid={errors.email ? true : false}
                            />
                            <FormFeedback>
                              {errors.email ? errors.email : null}
                            </FormFeedback>
                          </InputGroup>
                        </FormGroup>
                        <FormGroup
                          className={"auth-input-group position-relative "}
                        >
                          <InputGroup className="mb-3">
                            <InputGroupAddon
                              addonType="prepend"
                              className={errors.password ? "invalid" : " "}
                            >
                              <InputGroupText>
                                <i className="icon-lock" />
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input
                              type="password"
                              placeholder="Password"
                              autoComplete="new-password"
                              onChange={this.eventHandler}
                              value={password}
                              name="password"
                              invalid={errors.password ? true : false}
                            />
                            <FormFeedback>
                              {errors.password ? errors.password : null}
                            </FormFeedback>
                          </InputGroup>
                          <Button
                            id={"password"}
                            className={"help-btn rounded-circle"}
                          >
                            <i className={"fa fa-question"} />
                          </Button>
                          <UncontrolledPopover
                            className={"technician-popover"}
                            placement="top"
                            target={"password"}
                            trigger={"hover"}
                          >
                            <PopoverHeader>Password</PopoverHeader>
                            <PopoverBody>
                              <div className={"pb-2 technician-detail"}>
                                <div className={"text-capitalize pb-1"}>
                                  Password should be alphanumeric
                                  <small>
                                    {" (Use 6 or more characters with a mix of letters & numbers)"}
                                  </small>
                                  .
                                </div>
                              </div>
                            </PopoverBody>
                          </UncontrolledPopover>
                        </FormGroup>
                        <FormGroup className={"auth-input-group"}>
                          <InputGroup>
                            <InputGroupAddon
                              addonType="prepend"
                              className={
                                errors.confirmPassword ? "invalid" : " "
                              }
                            >
                              <InputGroupText>
                                <i className="icon-lock" />
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input
                              type="password"
                              placeholder="Confirm password"
                              autoComplete="new-password"
                              onChange={this.eventHandler}
                              name="confirmPassword"
                              value={confirmPassword}
                              invalid={errors.confirmPassword ? true : false}
                            />
                            <FormFeedback>
                              {errors.confirmPassword
                                ? errors.confirmPassword
                                : null}
                            </FormFeedback>
                          </InputGroup>
                        </FormGroup>
                        <FormGroup
                          className={"position-relative auth-input-group"}
                        >
                          <InputGroup>
                            <InputGroupAddon
                              addonType="prepend"
                              className={errors.companyName ? "invalid" : " "}
                            >
                              <InputGroupText>
                                <i className="icons cui-shield" />
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input
                              type="text"
                              placeholder="Company Name"
                              autoComplete="company-name"
                              onChange={this.eventHandler}
                              name="companyName"
                              value={companyName}
                              onBlur={this.onBlur}
                              invalid={errors.companyName ? true : false}
                            />
                            <FormFeedback>
                              {errors.companyName ? errors.companyName : null}
                            </FormFeedback>
                          </InputGroup>
                          <Button
                            id={"company"}
                            className={"help-btn rounded-circle"}
                          >
                            <i className={"fa fa-question"} />
                          </Button>
                          <UncontrolledPopover
                            className={"technician-popover"}
                            placement="top"
                            target={"company"}
                            trigger={"hover"}
                          >
                            <PopoverHeader>Company Name</PopoverHeader>
                            <PopoverBody>
                              <div className={"pb-2 technician-detail"}>
                                <div
                                  className={
                                    "text-capitalize pb-1 border-bottom"
                                  }
                                >
                                  Provide name of your company or Organization
                                </div>
                                <div className={"pt-2  text-note text-left"}>
                                  ex.&nbsp;serviceadvisor
                                </div>
                              </div>
                            </PopoverBody>
                          </UncontrolledPopover>
                        </FormGroup>
                        <FormGroup
                          className={"position-relative auth-input-group"}
                        >
                          <InputGroup>
                            <InputGroupAddon
                              addonType="prepend"
                              className={errors.workspace ? "invalid" : " "}
                            >
                              <InputGroupText>
                                <i className="icons cui-monitor" />
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input
                              type="text"
                              placeholder="Workspace"
                              autoComplete="new-workspace"
                              onChange={this.eventHandler}
                              name="workspace"
                              value={workspace}
                              invalid={errors.workspace ? true : false}
                            />
                            <FormFeedback>
                              {errors.workspace ? errors.workspace : null}
                            </FormFeedback>
                          </InputGroup>
                          <Button
                            id={"workspace"}
                            className={"help-btn rounded-circle"}
                          >
                            <i className={"fa fa-question"} />
                          </Button>
                          <UncontrolledPopover
                            className={"technician-popover"}
                            placement="top"
                            target={"workspace"}
                            trigger={"hover"}
                          >
                            <PopoverHeader>Workspace ?</PopoverHeader>
                            <PopoverBody>
                              <div className={"pb-2 technician-detail"}>
                                <div
                                  className={
                                    "text-capitalize pb-1 border-bottom"
                                  }
                                >
                                  Your work space will be an area reserved and
                                  identified uniquely by your company name
                                  followed by our company domain.
                                </div>
                                <div className={"pt-2  text-note text-left"}>
                                  EX: Your workspace name is "Peterbilt", so
                                  after signup, your URL will be
                                  http://peterbilt.serviceadvisor.io.
                                </div>
                              </div>
                            </PopoverBody>
                          </UncontrolledPopover>
                        </FormGroup>
                        <FormGroup className={"auth-input-group"}>
                          <InputGroup className="mb-4">
                            <InputGroupAddon
                              addonType="prepend"
                              className={
                                errors.companyWebsite ? "invalid" : " "
                              }
                            >
                              <InputGroupText>
                                <i className="icons cui-globe" />
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input
                              type="text"
                              placeholder="Company Website"
                              autoComplete="new-company-website"
                              onChange={this.eventHandler}
                              name="companyWebsite"
                              value={companyWebsite}
                              invalid={errors.companyWebsite ? true : false}
                            />
                            <FormFeedback>
                              {errors.companyWebsite
                                ? errors.companyWebsite
                                : null}
                            </FormFeedback>
                          </InputGroup>
                        </FormGroup>
                        <Row className={"m-0"}>
                          <Col xs="8" className={"mt-0 mb-0 ml-auto mr-auto"}>
                            <Button
                              color="primary"
                              className="px-4 btn-theme"
                              type="submit"
                              block
                              onClick={this.handleSubmit}
                            >
                              Sign Up
                            </Button>
                          </Col>
                        </Row>
                        <Row className="d-block mt-3 m-0">
                          <Col
                            xs="12"
                            sm={"12"}
                            md={"12"}
                            className="login-or-section text-center mt-2 mb-2"
                          >
                            <span>OR</span>
                          </Col>
                          <Col xs="12">
                            <p className="text-center">
                              Already have an account?
                              <Link to="/login"> Sign In </Link>
                            </p>
                          </Col>
                        </Row>
                        {/* </Form> */}
                      </>
                    ) : (
                        <ResendInvitation
                          resendConfimationLink={this.resendConfimationLink}
                        />
                      )}
                  </CardBody>
                </Card>
              </CardGroup>
            </Col>
          </Row>
        </div>
      </>
    );
  }
}

export default RegisterPage;
