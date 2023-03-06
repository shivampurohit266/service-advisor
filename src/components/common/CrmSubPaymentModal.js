import React, { Component } from "react";
import {
  Modal,
  ModalBody,
  ModalHeader,
  Form,
  ModalFooter,
  Button,
  Label,
  FormGroup,
  FormFeedback,
  Col
} from "reactstrap";
import MaskedInput from "react-text-mask";
import * as classnames from "classnames";
import stripImg from "../../assets/img/stripe-img.jpg";

export class CrmSubPaymentModalModel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cardNumber: "",
      expMonth: "",
      expYear: "",
      cvv: "",
      expireDate: "",
      expireYearError: "",
      expireMonthError: "",
      errors: {}
    };
  }
  componentDidUpdate(prevProps) {
    if (prevProps.openSubPayementModel !== this.props.openSubPayementModel) {
      this.removeAllState();
    }
  }
  async removeAllState() {
    this.setState({
      cardNumber: "",
      expMonth: "",
      expYear: "",
      cvv: "",
      expireDate: "",
      expireYearError: "",
      expireMonthError: "",
      errors: {}
    });
  }
  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
      errors: {
        ...this.state.errors,
        [name]: null
      }
    })
    if (name === "expireDate") {
      const expireDate = value.split('/')
      this.setState({
        expMonth: expireDate[0],
        expYear: expireDate[1],
        expireMonthError: null,
        expireYearError: null
      })
    }
  }
  handleSubscriptionPayment = () => {
    const { cardNumber, expMonth, expYear, cvv, expireDate } = this.state
    const payload = {
      planId: this.props.planId,
      cardNumber: cardNumber,
      expMonth: expMonth,
      expYear: expYear,
      cvv: cvv
    }
    let isError = false
    var n = new Date().getFullYear().toString().substr(2, 2);
    if (parseInt(payload.expMonth) > 12 && payload.expYear) {
      this.setState({
        expireMonthError: "Enter valid month.",
        expireYearError: null
      })
      isError = true
      return;
    }
    else if (parseInt(payload.expMonth) && !parseInt(payload.expYear)) {
      this.setState({
        expireMonthError: "Enter valid date.",
        expireYearError: null
      })
      isError = true
      return;
    }
    else if (parseInt(payload.expYear) < n && payload.expYear && payload.expMonth) {
      this.setState({
        expireYearError: "Expiretion year should be greater than current year",
        expireMonthError: null
      })
      isError = true
    } else {
      this.setState({
        expireYearError: "",
        expireMonthError: ""
      })
      isError = false
    }
    let isValid = true;
    let errors = { ...this.state.errors };
    if (!cardNumber.length) {
      errors.cardNumber = "Please enter card number."
      isValid = false;
    }
    if (!cvv.length) {
      errors.cvv = "Please enter card cvv number.";
      isValid = false;
    }
    if (!expireDate) {
      errors.expireDate = "Please enter card expiry date.";
      isValid = false
    }
    if (isError || !isValid) {
      this.setState({ errors });
      return;
    } else {
      this.props.addSubscriptionRequest(payload)
    }
  }
  render() {
    const { openSubPayementModel, handleSubPaymentModal } = this.props
    const { cardNumber, cvv, expireDate, expireMonthError, expireYearError, errors } = this.state;
    return (
      <>
        <Modal
          isOpen={openSubPayementModel}
          className='customer-modal custom-form-modal'
          backdrop={"static"}
        >
          <ModalHeader toggle={handleSubPaymentModal}>Subscription Payment</ModalHeader>
          <ModalBody>
            <Form onSubmit={this.handleSubscriptionPayment}>
              <div>
                <Col md={"12"}>
                  <FormGroup>
                    <Label />
                    <div className="stripImg">
                      <img src={stripImg} alt="stripe-img" />
                    </div>
                  </FormGroup>
                </Col>
                <Col md={"12"}>
                  <FormGroup>
                    <Label>Card Number<span className={"asteric"}>*</span></Label>
                    <div className={"input-block"}>
                      <MaskedInput
                        mask={[
                          /[0-9]/,
                          /\d/,
                          /\d/,
                          /\d/,
                          ' ',
                          /\d/,
                          /\d/,
                          /\d/,
                          /\d/,
                          ' ',
                          /\d/,
                          /\d/,
                          /\d/,
                          /\d/,
                          ' ',
                          /\d/,
                          /\d/,
                          /\d/,
                          /\d/,
                        ]}
                        className={classnames("form-control", {
                          "is-invalid": errors.cardNumber
                        })}
                        placeholder="Enter card number"
                        value={cardNumber}
                        name="cardNumber"
                        onChange={this.handleChange}

                      />
                      <FormFeedback>
                        {errors.cardNumber ? errors.cardNumber : null}
                      </FormFeedback>
                    </div>
                  </FormGroup>
                </Col>
                <div className="clearfix">
                  <Col md={"12"}>
                    <FormGroup>
                      <Label htmlFor="expiry">Expiration<span className={"asteric"}>*</span></Label>
                      <div className={"input-block"}>
                        <MaskedInput
                          mask={[/[0-9]/, /\d/, '/', /\d/, /\d/]}
                          className={classnames("form-control", {
                            "is-invalid":
                              (errors.expireDate || expireYearError || expireMonthError)
                          })}
                          placeholder="Enter expiry date"
                          id="expireDate"
                          name="expireDate"
                          value={expireDate}
                          onChange={this.handleChange}

                        />
                        <FormFeedback>
                          {expireYearError ? expireYearError : null}
                        </FormFeedback>
                        <FormFeedback>
                          {expireMonthError ? expireMonthError : null}
                        </FormFeedback>
                        <FormFeedback>
                          {errors.expireDate ? errors.expireDate : null}
                        </FormFeedback>
                      </div>
                    </FormGroup>
                  </Col>
                  <Col md={"12"}>
                    <FormGroup>
                      <Label htmlFor="cvv">CVC / CVV Number<span className={"asteric"}>*</span></Label>
                      <div className={"input-block"}>
                        <MaskedInput
                          mask={[/[0-9]/, /\d/, /\d/]}
                          className={classnames("form-control", {
                            "is-invalid": errors.cvv
                          })}
                          placeholder="Enter CVV"
                          id="cvv"
                          name="cvv"
                          value={cvv}
                          onChange={this.handleChange}
                        />
                        <FormFeedback>
                          {errors.cvv ? errors.cvv : null}
                        </FormFeedback>
                      </div>
                    </FormGroup>
                  </Col>
                </div>
              </div>
            </Form>
          </ModalBody>
          <ModalFooter>
            <div>
              <Button onClick={this.handleSubscriptionPayment} color="primary">Pay</Button>
            </div>
            <div>
              <Button onClick={handleSubPaymentModal} color="secondary">Cancel</Button>
            </div>
          </ModalFooter>
        </Modal>
      </>
    );
  }
}