import React, { Component } from "react";
import {
  Button,
  FormGroup,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormFeedback
} from "reactstrap";
import { logger } from "../../helpers";
import { SingupValidations, SingupValidationsMessaages } from "../../validations";
import Validator from "js-object-validation";
import ReCAPTCHA from "react-google-recaptcha";

export class CrmEnquiryModel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      errors: {},
      isGoogleVerified: false
    };
  }
  handleChange = (e) => {
    const { name, value } = e.target
    this.setState({
      [name]: value
    })
  }
  handleCaptcha = () => {
    this.setState({
      isGoogleVerified: true
    })
  }
  componentDidUpdate = ({ enquiryModalOpen }) => {
    if (enquiryModalOpen !== this.props.enquiryModalOpen) {
      this.setState({
        firstName: "",
        lastName: "",
        email: "",
        errors: {},
        isGoogleVerified: false
      })
    }
  }

  handleAddEnquiry = (e) => {
    e.preventDefault();
    this.setState({
      errors: {}
    });
    try {
      const {
        firstName,
        lastName,
        email,
      } = this.state;
      const d = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
      };
      let { isValid, errors } = Validator(
        d,
        SingupValidations,
        SingupValidationsMessaages
      );
      if (!isValid) {
        this.setState({
          errors,
          isLoading: false
        });
        return;
      }
      this.props.enquiryRequest(d)
    } catch (error) {
      logger(error)
    }
  }
  render() {
    const {
      firstName,
      lastName,
      email,
      errors,
      isGoogleVerified
    } = this.state
    const {
      enquiryModalOpen,
      handleEnquiryModal
    } = this.props
    return (
      <Modal
        isOpen={enquiryModalOpen}
        toggle={handleEnquiryModal}
        backdrop={"static"}
        className={"banner-form-modal"}
      >
        <ModalHeader toggle={handleEnquiryModal}>
        </ModalHeader>
        <ModalBody className={"p-0"}>
          <div className="banner-form wow tada " data-wow-delay="0.3s">
            <h4 className="form-title">Subscribe For All The Latest News And Update On The Service Advisor</h4>
            <Form onSubmit={this.handleAddEnquiry}>
              <FormGroup>
                {/* <Label htmlFor="name" className="customer-modal-text-style">
                  First Name <span className={"asteric"}>*</span>
                </Label> */}
                <div className={"input-block"}>
                  <Input
                    type="text"
                    name="firstName"
                    onChange={(e) => this.handleChange(e)}
                    placeholder="First Name*"
                    value={firstName}
                    maxLength="50"
                    id="name"
                    invalid={errors.firstName && !firstName ? true : false}
                  />
                  <FormFeedback>
                    {errors.firstName && !firstName ? errors.firstName : null}
                  </FormFeedback>
                </div>
              </FormGroup>
              <FormGroup>
                {/* <Label htmlFor="name" className="customer-modal-text-style">
                  Last Name <span className={"asteric"}>*</span>
                </Label> */}
                <div className={"input-block"}>
                  <Input
                    type="text"
                    name="lastName"
                    onChange={(e) => this.handleChange(e)}
                    placeholder="Last Name*"
                    value={lastName}
                    maxLength="50"
                    id="name"
                    invalid={errors.lastName && !lastName ? true : false}
                  />
                  <FormFeedback>
                    {errors.lastName && !lastName ? errors.lastName : null}
                  </FormFeedback>
                </div>
              </FormGroup>
              <FormGroup>
                {/* <Label htmlFor="name" className="customer-modal-text-style">
                  Email <span className={"asteric"}>*</span>
                </Label> */}
                <div className={"input-block"}>
                  <Input
                    type="text"
                    name="email"
                    onChange={(e) => this.handleChange(e)}
                    placeholder="Email*"
                    value={email}
                    maxLength="50"
                    id="name"
                    invalid={errors.email ? true : false}
                  />
                  <FormFeedback>
                    {errors.email ? errors.email : null}
                  </FormFeedback>
                </div>
              </FormGroup>
              <FormGroup>
                <ReCAPTCHA
                  sitekey="6LfYPMAUAAAAAFl1jDO2sHXCarmbRMo5CkUT1XgU"
                  onChange={this.handleCaptcha}
                />
              </FormGroup>
            </Form>
            <div className="shape1"></div>
            <div className="shape2"></div>
          </div>
        </ModalBody>
        <ModalFooter>
          <div className="required-fields">*Fields are Required.</div>
          <Button
            color=""
            type={"submit"}
            onClick={this.handleAddEnquiry}
            className={isGoogleVerified?"btn-form":"btn-form cursor-notallowed"}
            disabled={!isGoogleVerified ? true : false}
          >
            <i className={"fa fa-paper-plane mr-1"}></i> Submit
          </Button>{" "}
          <Button color="" onClick={handleEnquiryModal} className={"btn-cancel"}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}
