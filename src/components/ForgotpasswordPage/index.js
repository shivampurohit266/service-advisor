import Validator from "js-object-validation";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  Row,
  Col,
  CardGroup,
  Card,
  CardBody,
  Form,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
  Button,
  FormGroup,
  FormFeedback
} from "reactstrap";
import { logger } from "../../helpers/Logger";
import {
  ForgetPasswordValidations,
  ForgetPasswordValidationsMessaages
} from "../../validations";
import ServiceAdvisorLogo from "../../assets/logo-white.svg";
// import HomeHeader from "../HomePage/homeHeader";
// import HomeFooter from "../HomePage/homeFooter";
class ForgotpasswordPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      errors: {}
    };
  }
  requestForgetpassword = e => {
    e.preventDefault();
    this.setState({
      errors: {}
    });
    try {
      const { isValid, errors } = Validator(
        this.state,
        ForgetPasswordValidations,
        ForgetPasswordValidationsMessaages
      );
      if (!isValid) {
        this.setState({
          errors
        });
        return;
      }
      const { email } = this.state;
      this.props.onRequest({
        email
      });
    } catch (error) {
      logger(error);
    }
  };
  render() {
    const { email, errors } = this.state;
    return (
      <>
        <div className="app flex-row align-items-center auth-page  pt-3 pb-3">
          <div className="auth-bg" />
          <Row className="justify-content-center">
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
                <Card className="p-4">
                  <CardBody className="pl-4 pr-4 pt-0 pb-0">
                    <Form onSubmit={this.requestForgetpassword}>
                      <h1 className="auth-title">Forgot Password?</h1>
                      <p className="text-muted text-center text-info-line">
                        Enter the email address associated with your account
                    </p>
                      <FormGroup>
                        <InputGroup className="mb-3">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>@</InputGroupText>
                          </InputGroupAddon>
                          <Input
                            type="email"
                            placeholder="Email"
                            autoComplete="forgot-email"
                            name={"email"}
                            value={email}
                            invalid={errors.email}
                            onChange={e => {
                              this.setState({
                                email: e.target.value,
                                errors: {
                                  ...this.state.errors,
                                  email: null
                                }
                              });
                            }}
                          />
                          <FormFeedback>
                            {errors.email ? errors.email : null}
                          </FormFeedback>
                        </InputGroup>
                      </FormGroup>
                      <Row className={"m-0"}>
                        <Col sm="8" className={"mt-0 mb-0 ml-auto mr-auto"}>
                          <Button
                            className="btn btn-theme"
                            block
                            onClick={this.requestForgetpassword}
                          >
                            Send Reset Link
                        </Button>
                        </Col>
                      </Row>
                      <Row className="d-block mt-2 m-0">
                        <Col
                          xs="12"
                          sm={"12"}
                          md={"12"}
                          className="login-or-section text-center mt-3 mb-2"
                        >
                          <span>OR</span>
                        </Col>
                        <Col xs="12">
                          <p className="text-center">
                            Remember your password?
                          <Link to="/login"> Sign In </Link>
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

export default ForgotpasswordPage;
