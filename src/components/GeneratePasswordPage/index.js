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
  ResetPasswordValidations,
  ResetPasswordValidationsMessaages
} from "../../validations";
import ServiceAdvisorLogo from "../../assets/logo-white.svg";
class GeneratePasswordPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: "",
      confirmPassword: "",
      errors: {}
    };
  }
  componentDidMount() {
    logger(this.props);
  }
  generatePassword = e => {
    e.preventDefault();
    try {
      const { password, confirmPassword } = this.state;
      const payload = { password, confirmPassword };
      let { isValid, errors } = Validator(
        payload,
        ResetPasswordValidations,
        ResetPasswordValidationsMessaages
      );
      if (this.state.password !== "" & !errors.password) {
        let res = (this.state.password).match(/^(?=.*\d)(?=.*[a-zA-Z])[\w~@#$%^&*+=`|{}:;!.?()\]-]{6,20}$/);
        if (!res) {
          isValid = false;
          errors.password = "Password must have alphanumeric characters with optional (special characters)."
        }
      }
      if (!isValid) {
        this.setState({
          errors
        });
        return;
      }
      this.props.onGenerate(password);
    } catch (error) {
      logger(error);
    }
  };
  handleInputChange = e => {
    const { target } = e;
    const { value, name } = target;
    this.setState({
      [name]: value,
      errors: {
        ...this.state.errors,
        [name]: null
      }
    });
  };
  render() {
    const { password, confirmPassword, errors } = this.state;
    return (
      <div className="app flex-row align-items-center auth-page  pt-3 pb-3">
        <div className="auth-bg" />
        <Row className="justify-content-center">
          <Col md="6">
            <Col className="text-center">
              <h4 className="logo-title">
                <Link to="/home" target="_blank">
                  <img src={ServiceAdvisorLogo} alt={"logo"} />
                </Link>
              </h4>
            </Col>
            <CardGroup>
              <Card className="p-4">
                <CardBody>
                  <Form onSubmit={this.generatePassword}>
                    <h1 className="auth-title text-center">
                      Generate Password
                    </h1>
                    <p className="text-muted text-center text-info-line">
                      for your Account
                    </p>
                    <FormGroup>
                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-lock" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          type="password"
                          placeholder="Password"
                          autoComplete="username"
                          name={"password"}
                          value={password}
                          onChange={this.handleInputChange}
                          invalid={errors.password}
                        />
                        <FormFeedback>
                          {errors.password ? errors.password : null}
                        </FormFeedback>
                      </InputGroup>
                    </FormGroup>
                    <FormGroup>
                      <InputGroup className="mb-4">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-lock" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          type="password"
                          placeholder="Confirm Password"
                          autoComplete="confirm-password"
                          name={"confirmPassword"}
                          value={confirmPassword}
                          onChange={this.handleInputChange}
                          invalid={errors.confirmPassword}
                        />
                        <FormFeedback>
                          {errors.confirmPassword
                            ? errors.confirmPassword
                            : null}
                        </FormFeedback>
                      </InputGroup>
                    </FormGroup>
                    <Row className={"m-0"}>
                      <Col xs="8" className={"mt-0 mb-0 ml-auto mr-auto"}>
                        <Button
                          className="px-4 btn-theme"
                          block
                          onClick={this.generatePassword}
                        >
                          Generate Password
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                </CardBody>
              </Card>
            </CardGroup>
          </Col>
        </Row>
      </div>
    );
  }
}

export default GeneratePasswordPage;
