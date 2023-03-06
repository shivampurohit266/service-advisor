import Validator from "js-object-validation";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  CardGroup,
  Col,
  Form,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row,
  FormFeedback,
  FormGroup,
} from "reactstrap";
import { logger } from "../../helpers/Logger";
import { LoginValidations, LoginValidationsMessaages } from "../../validations";
import ServiceAdvisorLogo from "../../assets/logo-white.svg";
import * as qs from "query-string";

class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      isShowMsg: false,
      errors: {}
    };
  }
  componentDidMount() {
    const { location } = this.props;
    const lSearch = location.search;
    const { isShowMsg } = qs.parse(lSearch);
    this.setState({
      isShowMsg
    })

  }
  handleChange = e => {
    const { target } = e;
    e.preventDefault();
    const { name, value } = target;
    this.setState({
      [name]: value,
      errors: {
        ...this.state.errors,
        [name]: false
      }
    });
  };
  login = e => {
    e.preventDefault();
    this.setState({
      errors: {}
    });
    try {
      const { isValid, errors } = Validator(
        this.state,
        LoginValidations,
        LoginValidationsMessaages
      );
      if (!isValid) {
        this.setState({
          errors,
          isLoading: false
        });
        return;
      }
      const { email, password } = this.state;
      this.props.onLogin({
        email,
        password
      });
    } catch (error) {
      logger(error);
    }
  };
  render() {
    // const { settingData } = this.props;
    const { email, password, errors, isShowMsg } = this.state;
    return (
      <>
        <div className="app flex-row align-items-center auth-page  pt-3 pb-3">
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
                <Card className="p-4 pl-4 pr-4">
                  <CardBody className="pl-4 pr-4 pt-0 pb-0">
                    <Form onSubmit={this.login}>
                      {isShowMsg && isShowMsg === "true" ?
                        <p className={"text-danger text-center"}>Please Sign In to purchase Subscription Plan</p> : null}
                      <h1 className="auth-title text-center">Sign In</h1>
                      <p className="text-muted text-center text-info-line">
                        To Your Workspace
                    </p>
                      <FormGroup className={"auth-input-group"}>
                        <InputGroup className="mb-3">
                          <InputGroupAddon
                            addonType="prepend"
                            className={errors.email ? "invalid" : " "}
                          >
                            <InputGroupText>
                              <i className="icon-user" />
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input
                            type="text"
                            placeholder="Email"
                            autoComplete="username"
                            name={"email"}
                            value={email}
                            onChange={this.handleChange}
                            invalid={errors.email}
                          />
                          <FormFeedback>
                            {errors.email ? errors.email : null}
                          </FormFeedback>
                        </InputGroup>
                      </FormGroup>
                      <FormGroup className={"auth-input-group"}>
                        <InputGroup className="mb-4">
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
                            autoComplete="current-password"
                            name={"password"}
                            value={password}
                            onChange={this.handleChange}
                            invalid={errors.password}
                          />
                          <FormFeedback>
                            {errors.password ? errors.password : null}
                          </FormFeedback>
                        </InputGroup>
                      </FormGroup>
                      <Row className={"m-0"}>
                        <Col xs="8" className={"mt-0 mb-0 ml-auto mr-auto"}>
                          <Button className="px-4 btn-theme" block>
                            Sign In
                        </Button>
                        </Col>
                        <Col xs="12" className="text-center">
                          <Link to="/forgot-password">
                            <Button color="link" className="px-0">
                              Forgot password?
                          </Button>
                          </Link>
                        </Col>
                      </Row>
                      <Row className="d-block mt-2 m-0">
                        <Col
                          xs="12"
                          sm={"12"}
                          md={"12"}
                          className="login-or-section text-center mt-2 mb-2"
                        >
                          <span>OR</span>
                        </Col>
                        <Col xs="12">
                          {/* <Button className="btn-facebook btn-brand mr-1 mb-1" block><i className="fa fa-facebook"></i><span>Facebook</span></Button> */}
                          <p className="text-center">
                            Don't have an account?{" "}
                            <Link to="/signup">Sign Up </Link>
                          </p>
                        </Col>
                      </Row>
                    </Form>
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

export default LoginPage;
